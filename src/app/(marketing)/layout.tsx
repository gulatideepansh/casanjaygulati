import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

export default function MarketingLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
