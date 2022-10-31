import { Alert, Button, Card, Label, Spinner, TextInput } from 'flowbite-react';
import { useTranslation } from "../i18n";
import useWallet from '../use/useWallet';
import { setWalletChooses } from '../use/useWalletChooses';
import useWalletReady from '../use/useWalletReady';
import { setNick as setMyNick, getNick as getMyNick, getFee as getNickFee } from 'mynick-link-core/dist/mynick';
import { TX } from 'gudao-co-core/dist/progress';
import { getErrmsg } from 'gudao-co-core/dist/error';
import { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { TiTick } from 'react-icons/ti';
import { CurrencyValue } from 'mynick-link-core/dist/currency';

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

  if (!isReady) {
    return (<></>)
  }

  if (!wallet) {
    setWalletChooses({ allowClosed: false })
    return (<></>)
  }

  if (!loadingNick && currNick === undefined) {
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

  const setInputNick = (v: string) => {
    if (v.toLocaleLowerCase() === currNick?.toLocaleLowerCase()) {
      setFee(undefined)
    } else if (v.trim()) {
      getNickFee(v).then((rs) => {
        debugger
        if (_nick === v) {
          setFee(rs)
        }
      })
    }
    setNick(v)
    _nick = v
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

  return (
    <div className="container mx-auto max-w-xs sm:max-w-xl sm:p-4">
      <div className='flex justify-end pt-4 align-middle'>
        <div className='truncate font-medium text-3xl text-gray-900 dark:text-white flex-1 flex flex-row items-center'>
          {t('My Nick')}
        </div>
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
            <Button type="submit" disabled={loading||nick === currNick}>
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
