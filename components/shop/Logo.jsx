import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-12 h-12 rounded-full flex items-center justify-center">
        <img
          src="/logo.jpg"
          alt="S&S"
          width={24}
          height={24}
        />
      </div>
      <span className="font-semibold text-lg hidden sm:inline">
        Sleek & Shine
      </span>
    </Link>
  )
}
