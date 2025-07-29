import { SignInForm } from "@/app/modules/sign-in/sign-in";

const SignIn = () => {
    return (
        <main className="h-svh flex justify-center items-center" >
            <div className="flex flex-row md:flex-col items-center">
                <div className="flex flex-col items-center mb-6 gap-3">

                    <h1 className="font-bold text-2xl">Create Your Account</h1>
                    <p className="text-muted-foreground text-xl">Fill out the form below to sign up.</p>
                </div>
                <SignInForm />
            </div>
        </main>
    );
}

export default SignIn;