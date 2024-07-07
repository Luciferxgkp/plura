import Navigation from "@/components/site/natigation";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <main>
        <Navigation />
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
