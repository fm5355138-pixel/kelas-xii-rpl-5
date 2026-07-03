import React, { useEffect } from "react"
import Home from "./Home"
import Carousel from "./Gallery"
import FullWidthTabs from "./Tabs"
import Footer from "./Footer"
import Chat from "./ChatAnonim"
import AOS from "aos"
import "aos/dist/aos.css"

function App() {
	useEffect(() => {
		AOS.init()
		AOS.refresh()
	}, [])
	
	return (
		<>
			<Home />

			<Carousel />
			<FullWidthTabs />

			<div id="Mesh1"></div>


			<div
				className="lg:mx-[12%] lg:mt-[-5rem] lg:mb-20 hidden lg:block"
				id="ChatAnonim_lg"
				data-aos="fade-up"
				data-aos-duration="1200">
				<Chat />
			</div>

			<Footer />
		</>
	)
}

export default App
