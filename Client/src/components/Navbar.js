import { Link, Outlet, useParams } from "react-router-dom";
import { Search } from "./Search";
import icon from '../images/icon-blue.png'
import styles from "../styles/Navbar.module.css";
import { Login } from "./Login";
import { useState } from "react";

export function Navbar() {
  const { country, category } = useParams();
  //random number that is changed on each navbar item click to rerender the outlet
  const [random, setRandom] = useState(1);

  const triggerRandomizer = () => {
    setRandom(Math.random());
  }

  return (
    <main>
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft} onClick={(e) => triggerRandomizer()}>
          <Link to={"/top-headlines/"+ (country ? country : "US") + (category ? "/"+category : "/general")} className="navbarItem">
              <img className={styles.navbarImg}
                  width={50}
                  height={50}
                  src={ icon }
                  alt={"app icon"}
              ></img>
              <br/>
              <h1 className={styles.iconTitle}>News Now!</h1>
            </Link>
        </div>
        <div className={styles.navbarCenter} >
          <Link to={"/top-headlines/"+ (country ? country : "US") + (category ? "/"+category : "/general")} className="navbarItem" onClick={(e) => triggerRandomizer()}><div className={styles.navbarText}>Top Headlines</div></Link>
          <Link to={"/saved/"} className="navbarItem" onClick={(e) => triggerRandomizer()}><div className={styles.navbarText}>Saved News</div></Link>
          <Login className={styles.navbarLoginSmall} onLog={(e) => triggerRandomizer()} />
        </div>
        <div className={styles.navbarRight}>
          <Search className={styles.search} />
          <Login className={styles.loginComponent} onLog={(e) => triggerRandomizer()} />
        </div>
      </nav>
      <section>
        <Outlet key={random} />
      </section>
    </main>
  )
}
