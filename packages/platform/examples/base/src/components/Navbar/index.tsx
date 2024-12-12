import { useTranslation } from "react-i18next";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "800"] });

export function Navbar({ username }: { username?: string }) {
const { t } = useTranslation();

  return (
    <nav className="flex h-[75px] w-[100%] items-center justify-between bg-black px-14 py-3 text-white">
      <div className={`flex h-[100%] items-center text-lg ${poppins.className}`}>
        <Link href="/">
          <h1 className="bg-gradient-to-r from-[#8A2387] via-[#E94057] to-[#F27121] bg-clip-text text-2xl font-bold text-transparent">{t('cal-sync')}</h1>
        </Link>
      </div>
      {username && <div className="capitalize">👤 {username}</div>}
      <div className={`${poppins.className}`}>
        <ul className="flex gap-x-7">
          <li>
            <Link href="/calendars">{t('calendar')}</Link>
          </li>
          <li>
            <Link href="/availability">{t('availability')}</Link>
          </li>
          <li>
            <Link href="/event-types">{t('event-types')}</Link>
          </li>
          <li>
            <Link href="/booking">{t('book-me')}</Link>
          </li>
          <li>
            <Link href="/bookings">{t('my-bookings')}</Link>
          </li>
          <li>
            <Link href="/embed">{t('embed')}</Link>
          </li>

          <li>
            <Link href="/conferencing-apps">{t('conferencing-apps')}</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
