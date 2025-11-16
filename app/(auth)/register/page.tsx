import Link from "next/link";
import Image from "next/image";
import RegisterForm from "./RegisterForm";
import { Im500Px } from "react-icons/im";

const page = () => {
  const registerBannerImage: string | null =
    "https://images.pexels.com/photos/8845420/pexels-photo-8845420.jpeg";
  return (
    <section className="@container flex h-dvh w-full flex-col overflow-hidden">
      <div className="flex w-full flex-1 overflow-hidden">
        {/* form */}
        <div className="flex h-dvh w-full flex-col overflow-hidden">
          <header className="flex w-full items-center justify-between gap-10 px-5 pt-5">
            {/* logo */}
            <div className="flex items-center justify-start gap-3">
              <div className="bg-primary flex size-12 shrink-0 items-center justify-center rounded-full">
                <Im500Px className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  Growora
                </h1>
                <p className="text-xs text-gray-600">
                  Eat fresh. Live healthy. Choose Growora.
                </p>
              </div>
            </div>
            {/* logo */}

            {/* link */}
            <p className="text-xs text-gray-600">
              Already have an account?{" "}
              <Link
                className="font-semibold text-gray-800 hover:underline"
                href={"login"}
              >
                Login
              </Link>
            </p>
            {/* link */}
          </header>

          {/* form */}
          <div className="scrollbar-none my-10 flex w-full flex-1 flex-col items-center-safe justify-center-safe overflow-y-auto px-5">
            <h2 className="text-center text-3xl font-bold text-gray-800">
              Register Account
            </h2>

            <p className="mt-1 text-center text-xs text-balance text-gray-600">
              Sign up to access fresh, healthy, and handpicked produce every day
            </p>

            <div className="mt-10 w-full max-w-sm">
              <RegisterForm />
            </div>
          </div>
          {/* form */}

          <footer className="w-full px-5 pb-5">
            <p className="mx-auto max-w-xs text-center text-[0.65rem] text-balance text-gray-600">
              Copyright &copy; {new Date().getFullYear()} Growora (pvt) Ltd. All
              Rights Reserved. 
            </p>
          </footer>
        </div>
        {/* form */}

        {/* banner */}
        {registerBannerImage && (
          <div className="hidden h-full w-full p-1 @6xl:flex">
            <div className="relative size-full overflow-hidden rounded-2xl">
              <Image
                fill
                className="h-full object-cover"
                src={registerBannerImage}
                alt="Login banner image"
              ></Image>
            </div>
          </div>
        )}
        {/* banner */}
      </div>
    </section>
  );
};

export default page;
