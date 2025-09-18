import React from 'react'
import RestaurantBarImagesPage from '../components/restaurant-bar/RestaurantBarImagesPage'
import FoodMenu from '../components/restaurant-bar/FoodMenu'
import Menu from '../components/restaurant-bar/Menu'
import Footer from '../components/common/footer'
import ResturentTopBar from '../components/restaurant-bar/ResturentTopBar'

const RestaurantBarPage: React.FC = () => {
  return (
    <main>
      <ResturentTopBar />
      <RestaurantBarImagesPage />
      <FoodMenu />

      <Menu />
      <Footer />
    </main>
  )
}

export default RestaurantBarPage
