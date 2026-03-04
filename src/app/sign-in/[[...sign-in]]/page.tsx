import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal">
      <div className="text-center">
        <h1 className="mb-8 font-serif text-3xl font-semibold text-warm-white">
          Sales Tool
        </h1>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl",
            },
          }}
        />
      </div>
    </div>
  );
}
