import './App.css';
import {Suspense, useEffect,useState } from 'react';
import abi from './Land.json';
import {ethers} from "ethers";
import {Canvas} from '@react-three/fiber';
import {Sky,MapControls} from '@react-three/drei'
import {Physics} from '@react-three/cannon'
import Plane from './components/Plane';
import Building from './components/building';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
function App() {
const [state,setState]=useState({
    provider:null,
    signer:null,
    contract:null
  })
  const[landContract,setLandContracts]=useState(null)
  const[cost,setCost]=useState(null)
  const[account,setAccount]=useState(null)
  const[buildings,setBuildings]=useState(null)
  const[LandId,setLandId]=useState(null)
  const[LandName,setLandName]=useState(null)
  const[LandOwner,setLandOwner]=useState(null)
  const[hasOwner,setHasOwner]=useState(null)

  useEffect(()=>{
    const connectWallet=async()=>{
      const contractAddress="0x0227eC66519f16BEe5f9fA0DCe712D4277765fb2";
      const contractAbi=abi.abi;
      try{
        const{ethereum}=window;
        if(ethereum){
          const account=await ethereum.request({method:"eth_requestAccounts",})
          setAccount(account)
         }
        const provider=new ethers.providers.Web3Provider(ethereum);
        const signer=provider.getSigner();
        const contract= new ethers.Contract(contractAddress,contractAbi,signer);
        const cost=await contract.cost();
        setCost(cost/1000000000000000000);
        setLandContracts(contract)
        setState({provider,signer,contract});
        const buildings = await contract.getBuildings()
        setBuildings(buildings)
      }
      catch(error){
        console.log(error);
      }
    };
    connectWallet();
},[]); 
  console.log(state);
  const buyHandler=async(_id)=>{
    try{
    await landContract.mint(_id, {value: ethers.utils.parseEther('1')})
    setLandName(buildings[_id - 1].name)
    setLandOwner(buildings[_id - 1].owner)
    setHasOwner(true)
  } catch (error) {
    window.alert('Your metamask wallet is not having sufficient amount')
  }
  };
 return (
  <div>
  <div>
  <Navbar  bg="light" variant="light">
        <Container>
          <Navbar.Brand><h1>Metaverse Web-3.0</h1></Navbar.Brand>
          <Navbar.Brand><h4>Connected Account: {account}</h4></Navbar.Brand>
         </Container>
  </Navbar>
  </div>
     <Canvas camera={{ position: [0, 0, 30], up: [0, 0, 1], far: 10000 }}>
				<Suspense fallback={null}>
					<Sky distance={450000} sunPosition={[1, 10, 0]} inclination={0} azimuth={0.25} />
          <ambientLight intensity={0.5} />
          <Physics>
						{buildings && buildings.map((building, index) => {
							return (
									<Building
										key={index}
										position={[building.posX, building.posY, 0.1]}
										size={[building.sizeX, building.sizeY, building.sizeZ]}
										landId={index + 1}
										landInfo={building}
										setLandName={setLandName}
										setLandOwner={setLandOwner}
										setHasOwner={setHasOwner}
										setLandId={setLandId}
									/>
								)
                })}
					</Physics>
          <Plane />
				</Suspense>
				<MapControls />
			</Canvas>

			{LandId && (
				<div className="info">
					<h1 className="flex">{LandName}</h1>

					<div className='flex-left'>
						<div className='info--id'>
							<h2>ID</h2>
							<p>{LandId}</p>
						</div>

						<div className='info--owner'>
							<h2>Owner</h2>
							<p>{LandOwner}</p>
						</div>

						{!hasOwner && (
							<div className='info--owner'>
								<h2>Cost</h2>
								<p>{`${cost} ETH`}</p>
							</div>
						)}
					</div>
          {!hasOwner && (
						<button onClick={() => buyHandler(LandId)} className='button info--buy'>Buy Property</button>
            
					)}
          </div>
			)}
     
          
		</div>
	
  );
}
export default App;