import { useModal } from "@/app/context/modal-context";
import Image from "next/image";


export const NoUserContent = () => {
    const { openSignInModal } = useModal();


    return (
        <div className="w-full py-10 px-6 mx-auto max-w-[1070px]">
            <div className="max-w-[460px] flex flex-col mx-auto items-center">
                <Image height={712} width={1033} src={`/assets/login.webp`} alt="login-image" />
                <h1 className="text-2xl font-bold text-[#032b41] text-center mb-4">Log in to your account to see your library.</h1>
                <button onClick={openSignInModal} className="bg-[#2bd97c] text-[#032b41] w-[180px] h-10 rounded-sm transition-colors duration-200 flex items-center justify-center min-w-[180px] hover:bg-[#20ba68]">Login</button>
            </div>
        </div>
    )
}