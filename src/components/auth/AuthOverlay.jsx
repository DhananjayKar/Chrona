export default function AuthOverlay({ isRegister, setIsRegister }) {
    return (
        <div className={`absolute top-0 h-full w-1/2 bg-blue-600 text-white flex flex-col items-center justify-center text-center px-8 transition-all duration-500 ${ isRegister? "left-0":"left-1/2" }`}
        style={{ borderRadius: isRegister? "0 150px 100px 0" : "150px 0 0 100px" }} >
            { isRegister ? (
                <>
                    <h1 className="text-3xl font-bold mb-4">Hello!</h1>
                    <p className="mb-4">Register to use all features</p>
                    <button onClick={()=> setIsRegister(false)} className="border border-white px-6 py-2 rounded-xl">Sign In</button>
                </>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
                    <p className="mb-6">Provide your details to continue</p>
                    
                    <button onClick={()=> setIsRegister(true)} className="border border-white px-6 py-2 rounded-xl">Sign Up</button>
                </>
            )}
        </div>
    );
}