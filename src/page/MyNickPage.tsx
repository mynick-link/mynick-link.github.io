import { Alert, Button, Card, Label, Spinner, TextInput } from 'flowbite-react';
import { useTranslation } from "../i18n";
import useWallet from '../use/useWallet';
import { setWalletChooses } from '../use/useWalletChooses';
import useWalletReady from '../use/useWalletReady';
import { setNick as setMyNick, getNick as getMyNick, canSetNick } from 'mynick-link-core/dist/mynick';
import { TX } from 'mynick-link-core/dist/progress';
import { getErrmsg } from 'mynick-link-core/dist/error';
import { useState } from 'react';
import { HiBadgeCheck, HiExclamation, HiInformationCircle } from 'react-icons/hi';
import { TiTick } from 'react-icons/ti';
import { CurrencyValue } from 'mynick-link-core/dist/currency';
import { useNavigate } from 'react-router-dom';

function MyNickPage() {
  const { t } = useTranslation()
  const [wallet,] = useWallet()
  const [isReady,] = useWalletReady()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [errmsg, setErrmsg] = useState('')
  const [tx, setTX] = useState<TX>()
  const [currNick, setCurrNick] = useState<string>()
  const [nick, setNick] = useState('')
  const [success, setSuccess] = useState(false)
  const [loadingNick, setLoadingNick] = useState(false)
  const [fee, setFee] = useState<CurrencyValue>()
  const [loadingInput, setLoadingInput] = useState(false)
  const [inputErrmsg, setInputErrmsg] = useState('')
  const [addr, setAddr] = useState('')
  const navigate = useNavigate()

  if (!isReady) {
    return (<></>)
  }

  if (!wallet) {
    setWalletChooses({ allowClosed: false })
    return (<></>)
  }

  let _addr = addr
  let _currNick = currNick

  if (addr === '') {
    _addr = wallet.addr
    setAddr(wallet.addr)
  } else if (_addr !== wallet.addr) {
    _addr = wallet.addr
    setAddr(wallet.addr)
    if (currNick !== undefined) {
      setCurrNick(undefined)
      _currNick = undefined
    }
  }

  if (!loadingNick && _currNick === undefined) {
    setLoadingNick(true)
    getMyNick(wallet.addr).then((rs) => {
      setLoadingNick(false)
      setCurrNick(rs)
      setNick(rs)
    }, (reason) => {
      setCurrNick('')
      setLoadingNick(false)
      setErrmsg(getErrmsg(reason))
    })
  }

  const onSubmit = () => {
    if (loading) {
      return
    }
    setSuccess(false)
    setLoading(true)
    setErrmsg('')
    setMyNick(nick, (s) => {
      if (s.name === 'tx') {
        setTX(s.tx!)
      } else if (s.title) {
        setProgress(s.title)
      }
    }).then(() => {
      setSuccess(true)
      setLoading(false)
    }, (reason) => {
      setErrmsg(getErrmsg(reason))
      setLoading(false)
    })
    return false;
  };

  let _nick = nick;
  let _tv: any = undefined;

  const startLoadingInput = () => {
    if (_tv) {
      clearTimeout(_tv)
      _tv = undefined
    }
    if (_nick.toLocaleLowerCase() === currNick?.toLocaleLowerCase()) {
      setFee(undefined)
      setInputErrmsg('')
      setLoadingInput(false)
    } else if (_nick) {
      setFee(undefined)
      setLoadingInput(true)
      let v = _nick
      _tv = setTimeout(() => {
        if (v === _nick) {
          if (_tv) {
            clearTimeout(_tv)
            _tv = undefined
          }
          canSetNick(v).then((rs) => {
            if (v === _nick) {
              setLoadingInput(false)
              setInputErrmsg('')
              setFee(rs)
            }
          }, (reason) => {
            if (v === _nick) {
              setLoadingInput(false)
              setInputErrmsg(getErrmsg(reason))
            }
          })
        }
      }, 600)
    } else {
      setFee(undefined)
      setInputErrmsg('')
      setLoadingInput(false)
    }
  };

  const setInputNick = (v: string) => {
    let vv = v.replace(/[\u3000 \r\n\t\f]/g,'')
    setNick(vv)
    _nick = vv
    startLoadingInput();
  };

  let failureAlert = <></>

  if (errmsg) {
    failureAlert =
      <div className='pt-4'>
        <Alert
          color="failure"
          icon={HiInformationCircle}
        >
          <span>
            {errmsg}
          </span>
        </Alert>
      </div>
  }

  let loadingSpinner = (light: boolean = true) => {
    return <></>
  }

  if (loading) {
    loadingSpinner = (light: boolean = true) => {
      return <Spinner color="success" size="sm" light={light} style={{ lineHeight: "100%", marginRight: "6px" }} ></Spinner>
    }
  }

  let infoAlert = <></>

  if (success) {
    infoAlert =
      <div className='pt-4'>
        <Alert
          color="info"
          icon={HiInformationCircle}
        >
          <span>
            <span className="font-medium">
              Success
            </span>
          </span>
        </Alert>
      </div>
  } else if (tx) {
    infoAlert =
      <div className='pt-4'>
        <Alert
          color="info"
          icon={loading ? undefined : TiTick}
        >
          <span>
            {loadingSpinner(false)}
            <span className="font-medium align-middle">
              {'TX: '}
            </span>
            <a href={tx.url} target="_blank" rel="noreferrer" className='align-middle'>{tx.hash.substring(0, 6) + '...' + tx.hash.substring(tx.hash.length - 6)}</a>
          </span>
        </Alert>
      </div>
  }

  let inputStateView = <></>

  if (currNick !== undefined && _nick.toLocaleLowerCase() !== currNick.toLocaleLowerCase()) {
    if (loadingInput) {
      inputStateView = <Spinner size='sm' color='success'></Spinner>
    } else if (inputErrmsg) {
      inputStateView = <span className='flex flex-row items-center gap-2'>
        <HiExclamation></HiExclamation>
        <span>{inputErrmsg}</span>
      </span>
    } else {
      inputStateView = <span className='flex flex-row items-center gap-2 text-sm'>
        <HiBadgeCheck></HiBadgeCheck>
        <span>Availabled</span>
      </span>
    }
  }

  let sellButton = <></>

  if (currNick !== undefined && currNick !== '') {
    sellButton = <Button
      onClick={() => navigate('/sell')}
    >
      {t('Sell')}
    </Button>
  }

  return (
    <div className="container mx-auto max-w-xs sm:max-w-xl sm:p-4">
      <div className='flex justify-end pt-4 align-middle'>
        <div className='truncate font-medium text-3xl text-gray-900 dark:text-white flex-1 flex flex-row items-center'>
          {t('My Nick')}
        </div>
        {sellButton}
      </div>
      {failureAlert}
      {infoAlert}
      <div className='pt-4'>
        <Card>
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); return onSubmit(); }}>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="owner"
                  value="Owner"
                />
              </div>
              <TextInput
                id="owner"
                type="text"
                readOnly={true}
                value={wallet.addr}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="nick"
                  value="Nick"
                />
              </div>
              <TextInput
                id="nick"
                type="text"
                value={loadingNick ? '...' : nick}
                onChange={(e) => setInputNick(e.currentTarget.value)}
                placeholder=""
                readOnly={loadingNick || loading}
                helperText={inputStateView}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="fee"
                  value="Fee"
                />
              </div>
              <TextInput
                id="fee"
                type="text"
                value={fee ? fee.value : '--'}
                readOnly={true}
                addon={fee ? fee.currency.symbol : 'USDT'}
              />
            </div>
            <Button type="submit" disabled={loading || nick === currNick || loadingNick || loadingInput || inputErrmsg !== ''}>
              {loadingSpinner(true)}
              {t(loading ? progress : 'Submit')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default MyNickPage;
