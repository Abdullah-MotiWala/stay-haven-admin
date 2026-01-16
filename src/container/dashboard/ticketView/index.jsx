import leftangle from '../../../assets/icons/leftangle.png';
import TicketChatUI from '../../../components/chatBox';
const TiketView = ()=>{
    return(<>
    <div>
         <div className='flex gap-1 border-solid border-b border-gray-300 mb-2 pb-4 flex items-center gap-4'>
                  <img src={leftangle} alt="" />
                  <button className='text-gray-600 flex'>Back</button>
        
                </div>
                <TicketChatUI/>
    </div>
    <p>hey</p>
    </>)
} 

export default TiketView;