import { ArrowLeftRight, ChartColumn, ChartColumnStacked, Cog, House, Menu, Moon, Sun } from "lucide-react";
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Stats from './pages/Stats';
import Settings from "./pages/Settings";
import { useState } from "react";

export default function App() {

  const location = useLocation();
  const [theme, setTheme] = useState("light");
  const [openMenu, setopenMenu] = useState(true)
  const [quickSettings, setQuickSettings] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <div className={`w-screen h-screen flex justify-center items-center overflow-hidden p-0 transition-colors duration-200 ${theme === 'dark'
        ? "bg-gradient-to-tr from-blue-500/80 via-purple-500/80 to-black-500/80"
        : "bg-gradient-to-tr from-indigo-600/80 via-purple-500/80 to-indigo-100/80"
        }`}>

        <div className="h-screen md:h-screen xl:h-[80vh] w-full max-w-7xl 
          flex flex-col gap-4 bg-base-100/30 backdrop-blur-xl shadow-sm p-4 rounded-4xl transition-all duration-500
        ">

          <header className="w-full flex gap-5">
            <div className="navbar bg-base-300/50 shadow-sm rounded-3xl flex w-full transition-all duration-500">
              <div className="flex-none mr-9">
                <label className="swap swap-rotate">
                  <input
                    type="checkbox"
                    className="theme-controller"
                    checked={openMenu}
                    onChange={() => setopenMenu(prev => !prev)}
                  />
                  <Menu
                    className={`h-8 w-8 ${openMenu ? "rotate-0" : "rotate-90"}`}
                    viewBox="0 0 24 24">
                  </Menu>
                </label>
              </div>
              <div className="">
                <a className="btn btn-ghost text-xl transition-all duration-500">Tracksy</a>
              </div>
              <div className="flex ml-auto">
                <div className={`transition-all duration-500 ${quickSettings ? "w-9" : "overflow-hidden pointer-events-none w-0 opacity-0 scale-50"}`}>
                  <div className="flex-none">
                    <label className="swap swap-rotate">
                      <input
                        type="checkbox"
                        className="theme-controller"
                        value="dark"
                        checked={theme === "dark"}
                        onChange={toggleTheme}
                      />
                      <Moon
                        className="swap-off h-8 w-8"
                        viewBox="0 0 24 24">
                      </Moon>
                      <Sun
                        className="swap-on h-8 w-8"
                        viewBox="0 0 24 24">
                      </Sun>
                    </label>
                  </div>
                </div>
                <button
                  className="btn rounded-2xl btn-ghost"
                  onClick={() => setQuickSettings(prev => !prev)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
                </button>
              </div>
            </div>
          </header>
          <main className="flex flex-1 min-h-0 w-full">

            <div className={`bg-base-300/50 flex flex-col items-center justify-around transition-all overflow-hidden duration-500
              ${openMenu ? 'w-20 mr-4 rounded-3xl shadow-sm' : 'mb-3 mt-3 w-0 opacity-0'}
            `}>
              <Link
                to="/"
                className={`transition-all duration-300 rounded-2xl btn
                  ${location.pathname === '/'
                    ? "btn-outline btn-primary"
                    : "bg-base-100/0 border-none shadow-none"}
                `}
              >
                <House />
              </Link>
              <Link
                to="/transactions"
                className={`transition-all duration-300 rounded-2xl btn
                  ${location.pathname === '/transactions'
                    ? "btn-outline btn-primary"
                    : "bg-base-100/0 border-none shadow-none"}
                `}
              >
                <ArrowLeftRight />
              </Link>
              <Link
                to="/categories"
                className={`transition-all duration-300 rounded-2xl btn
                  ${location.pathname === '/categories'
                    ? "btn-outline btn-primary"
                    : "bg-base-100/0 border-none shadow-none"}
                `}
              >
                <ChartColumnStacked />
              </Link>
              <Link
                to="/stats"
                className={`transition-all duration-300 rounded-2xl btn
                  ${location.pathname === '/stats'
                    ? "btn-outline btn-primary"
                    : "bg-base-100/0 border-none shadow-none"}
                `}
              >
                <ChartColumn />
              </Link>
              <Link
                to="/settings"
                className={`transition-all duration-300 rounded-2xl btn
                  ${location.pathname === '/settings'
                    ? "btn-outline btn-primary"
                    : "bg-base-100/0 border-none shadow-none"}
                `}
              >
                <Cog />
              </Link>
            </div>

            <div className="bg-base-200/50 shadow-sm rounded-3xl flex-1 p-5 transition-all overflow-auto duration-500">
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/transactions' element={<Transactions />} />
                <Route path='/categories' element={<Categories />} />
                <Route path='/stats' element={<Stats />} />
                <Route path='/settings' element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}