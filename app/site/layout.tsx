import Navigation from "@/components/site/natigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <main className="h-full">
        <Navigation />
        {children}
      </main>
    </ClerkProvider>
  );
};

export default AuthLayout;
