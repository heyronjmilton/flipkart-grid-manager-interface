import { Link } from "react-router-dom"


function Home(){
    return(
        <div className="bg-[#FFFDD0] flex flex-col space-y-4 items-center justify-center h-screen">

            <h1 className="text-5xl text-black font-extrabold ">Choose an Option    </h1>
            <button className="bg-[#2563EB] w-40 p-1 shadow-2xl rounded-lg text-2xl font-bold">
                <Link to='/insights'>
                    Insights
                </Link>
            </button>
            <button className="bg-[#2563EB] w-40 p-1 shadow-2xl rounded-lg text-2xl font-bold">
                <Link to='/expired-items'>
                    Expired Items
                </Link>
            </button>
            
            

        </div>
    )
}

export default Home