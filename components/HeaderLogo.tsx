import Image from "next/image"
import Link from "next/link"

const HeaderLogo = () => {
    return (
        <>
            <Link href="/">
                <div className="items-center hidden lg:flex">
                    <Image 
                        src="/logo.svg" 
                        alt="R Finance" 
                        width={30} 
                        height={30}
                    />
                    <p className="font-semibold text-white text-2xl ml-2.5">R Finance</p>
                </div>
            </Link>
        </>
    )
}

export default HeaderLogo