import { Alert, Button, Card, Label, Spinner, TextInput } from 'flowbite-react';
import { useTranslation } from "../i18n";
import useWallet from '../use/useWallet';
import { setWalletChooses } from '../use/useWalletChooses';
import useWalletReady from '../use/useWalletReady';
import { getNick as getMyNick, setSellAmount, getSellAmount } from 'mynick-link-core/dist/mynick';
import { TX } from 'mynick-link-core/dist/progress';
import { getErrmsg } from 'mynick-link-core/dist/error';
import { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { TiTick } from 'react-icons/ti';
import { Currency } from 'mynick-link-core/dist/currency';

function SellPage() {
    const { t } = useTranslation()
    const [wallet,] = useWallet()
    const [isReady,] = useWalletReady()
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState('')
    const [errmsg, setErrmsg] = useState('')
    const [tx, setTX] = useState<TX>()
    const [currNick, setCurrNick] = useState<string>()
    const [success, setSuccess] = useState(false)
    const [loadingNick, setLoadingNick] = useState(false)
    const [feeCurrency, setFeeCurrency] = useState<Currency>()
    const [inputAmount, setInputAmount] = useState('0')
    const [addr, setAddr] = useState('')

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
            let nick = rs;
            getSellAmount().then((rs) => {
                setLoadingNick(false)
                setCurrNick(nick)
                setInputAmount(rs.value)
                setFeeCurrency(rs.currency)
            }, () => {
                setLoadingNick(false)
                setCurrNick(nick)
            })
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
        setSellAmount(inputAmount, (s) => {
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
                    {t('Sell Nick')}
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
                                readOnly={loadingNick || loading}
                                value={loadingNick ? '...' : currNick}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="amount"
                                    value="Sell Amount"
                                />
                            </div>
                            <TextInput
                                id="amount"
                                type="number"
                                inputMode='numeric'
                                value={inputAmount}
                                onChange={(e) => { setInputAmount(e.currentTarget.value) }}
                                addon={feeCurrency ? feeCurrency.symbol : 'USDT'}
                            />
                        </div>
                        <Button type="submit" disabled={loading || loadingNick || currNick === undefined || currNick === ''}>
                            {loadingSpinner(true)}
                            {t(loading ? progress : 'Submit')}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default SellPage;
