import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">
              Sleek & Shine
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Premium cosmetics and beauty products for everyone.  
              Elevate your beauty routine with confidence.
            </p>

            <div className="flex items-center gap-2">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted"
                  asChild
                >
                  <a href="#" aria-label={Icon.name}>
                    <Icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          {[
            {
              title: "Quick Links",
              links: [
                { label: "Shop", href: "/shop" },
                { label: "About Us", href: "#" },
                { label: "Contact", href: "#" },
                { label: "Blog", href: "#" },
              ],
            },
            {
              title: "Support",
              links: [
                { label: "FAQ", href: "#" },
                { label: "Shipping Info", href: "#" },
                { label: "Returns", href: "#" },
                { label: "Track Order", href: "#" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy Policy", href: "#" },
                { label: "Terms & Conditions", href: "#" },
                { label: "Cookie Policy", href: "#" },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 Sleek & Shine. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span>Secure Payments</span>
            <span>Fast Shipping</span>
            <span>30-Day Returns</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
