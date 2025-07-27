import { SignUpForm } from "@/app/modules/sign-up/sign-up";

const SignUp = () => {
    return (
        <main style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <div>
                <h1>Create Your Account</h1>
                <p>Fill out the form below to sign up.</p>
                <SignUpForm /> {/* This renders your component on this page */}
            </div>
        </main>

    );
}

export default SignUp;