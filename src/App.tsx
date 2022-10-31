import { Navbar, Flowbite, DarkThemeToggle, Footer, Alert, Toast } from 'flowbite-react';
import logo512 from './image/logo512.png';
import { useTranslation } from "./i18n";
import {
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import WalletConnect from './view/WalletConnect';
import WalletChooses from './view/WalletChooses';
import { HiOutlineMail } from 'react-icons/hi';
import { TbBrandTelegram } from 'react-icons/tb';
import LanguageChooses from './view/LanguageChooses';
import useAlert from './use/useAlert';
import useToast from './use/useToast';
import HomePage from './page/HomePage';
import MyNickPage from './page/MyNickPage';
import DevPage from './page/DevPage';
import NickPage from './page/NickPage';
import AddressPage from './page/AddressPage';

function App() {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();
  const [toast, setToast] = useToast();

  const items: { title: string, href: string }[] = [
    {
      title: t('Home'),
      href: '/'
    },
    {
      title: t('MyNick'),
      href: '/mynick'
    },
    {
      title: t('Developer'),
      href: '/dev'
    }
  ];

  let alertView = <></>

  if (alert) {
    let currAlert = alert
    alertView =
      <div className='pb-4'>
        <Alert
          color={alert.color}
          icon={alert.icon}
        >
          {alert.title}
        </Alert>
      </div>
    if (alert.duration) {
      setTimeout(() => {
        if (currAlert === alert) {
          setAlert(undefined)
        }
      }, alert.duration)
    }
  }

  let toastView = <></>

  if (toast) {
    let currToast = toast
    toastView = <div className='fixed right-8 top-16'>
      <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
          {toast.icon}
        </div>
        <div className="ml-3 text-sm font-normal">
          {toast.body}
        </div>
        <Toast.Toggle />
      </Toast>
    </div>
    if (toast.duration) {
      setTimeout(() => {
        if (currToast === toast) {
          setToast(undefined)
        }
      }, toast.duration)
    }
  }


  return (
    <Flowbite theme={{
      theme: {
        alert: {
          color: {
            primary: 'bg-primary'
          }
        },
        minWidth: {
          '1/2': '50%'
        },
      }
    }} className="min-h-screen">
      <Navbar
        fluid={true}
        rounded={true}
      >
        <Navbar.Toggle />
        <Navbar.Brand href="https://mynick.link/" style={{ minWidth: "fit-content" }}>
          <img
            src={logo512}
            className="mr-3 h-6 sm:h-7"
            alt="MYNICK.LINK"
          />
          <span className="self-center whitespace-nowrap text-sl sm:text-xl font-semibold dark:text-white mr-3 min-w-fit">
          MYNICK.LINK
          </span>
        </Navbar.Brand>
        <Navbar.Collapse>
          {
            items.map((item) => (
              <Navbar.Link onClick={() => { navigate(item.href) }} style={{ "cursor": "pointer" }} key={item.href}>
                {item.title}
              </Navbar.Link>
            ))
          }
          <div className='p-2 sm:p-0'></div>
        </Navbar.Collapse>
        <div className="flex items-center flex-nowrap">
          <div className='mr-1 hidden sm:flex'>
            <DarkThemeToggle />
            <LanguageChooses></LanguageChooses>
          </div>
          <WalletConnect></WalletConnect>
        </div>
      </Navbar>
      <div className='py-4 flex-1'>
        {alertView}
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="/mynick" element={<MyNickPage></MyNickPage>}> </Route>
          <Route path="/dev" element={<DevPage></DevPage>}></Route>
          <Route path="/nick/:nick" element={<NickPage></NickPage>}></Route>
          <Route path="/address/:addr" element={<AddressPage></AddressPage>}></Route>
        </Routes>
      </div>
      <Footer container={true}>
        <Footer.Copyright
          href="#"
          by="MYNICK.LINK™"
          year={2022}
        />
        <Footer.LinkGroup>
          <Footer.Icon href="https://t.me/gudao_co" target="_blank" icon={TbBrandTelegram}></Footer.Icon>
          <span className='px-2'></span>
          <Footer.Icon href="mailto:info@gudao.co" target="_blank" icon={HiOutlineMail}></Footer.Icon>
        </Footer.LinkGroup>
      </Footer>
      <WalletChooses></WalletChooses>
      {toastView}
    </Flowbite >
  );
}

export default App;
