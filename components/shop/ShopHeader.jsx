"use client"

import Logo from "./Logo"
import SearchBar from "./SearchBar"
import CartButton from "./CartButton"
import AccountMenu from "./AccountMenu"

export default function ShopHeader({ cartItemsCount, onCartClick }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-2">
        <Logo />
        <SearchBar />
        <div className="flex items-center gap-2 md:gap-4">
          <CartButton count={cartItemsCount} onClick={onCartClick} />
          <AccountMenu />
        </div>
      </div>
    </header>
  )
}
