import TrackPlayer from 'react-native-track-player';


module.exports = async function () {
    TrackPlayer.addEventListener('remote-play', () => {
      TrackPlayer.play();
      });
    TrackPlayer.addEventListener('remote-duck', () => {
        TrackPlayer.pause();
      });
      
      TrackPlayer.addEventListener('remote-pause', () => {
       TrackPlayer.pause();
       
      });
      
      TrackPlayer.addEventListener('remote-stop', () => {
        TrackPlayer.stop();
      });
      
      TrackPlayer.addEventListener('remote-next', async() => {  
          
       try{
        await TrackPlayer.skipToNext()
       }catch{
        console.log('on last track')
       }
      
      });
      
      TrackPlayer.addEventListener('remote-previous', async() => {

        try{
          await TrackPlayer.skipToPrevious()
        }catch{
          console.log('on first track')
        }
        
      });
      
      TrackPlayer.addEventListener('playback-queue-ended', async () => { 
        TrackPlayer.stop()
      });

   
};