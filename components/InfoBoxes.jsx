import InfoBox from "./InfoBox"

const InfoBoxes = () => {
  return (
    <section>
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <InfoBox 
          heading= 'For renters'
          background="bg-gray-100"
          buttonInfo={{
            text: 'Browse properties',
            link: '/properties',
            backgroundColor: 'bg-black'
          }}>
            Find your dream rentals
        </InfoBox>
        <InfoBox 
          heading= 'For property owners'
          background='bg-blue-100'
          buttonInfo={{
            text: 'Add properties',
            link: '/properties/add',
            backgroundColor: 'bg-blue-500'
          }}>
            Find your dream rentals
        </InfoBox>
        </div>
      </div>
    </section>
  )
}

export default InfoBoxes