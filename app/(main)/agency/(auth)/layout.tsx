const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;
