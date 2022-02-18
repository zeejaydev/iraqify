import TrackPlayer, {Event, State} from 'react-native-track-player';
let wasPausedByDuck = false;

module.exports = async function setup () {
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
      TrackPlayer.play();
      });
      
      TrackPlayer.addEventListener(Event.RemotePause, () => {
       TrackPlayer.pause();
       
      });
      
      TrackPlayer.addEventListener(Event.RemoteStop, () => {
        TrackPlayer.stop();
      });
      
      TrackPlayer.addEventListener(Event.RemoteNext, async() => {  
          
       try{
        await TrackPlayer.skipToNext()
       }catch{
        console.log('on last track')
       }
      
      });
      
      TrackPlayer.addEventListener(Event.RemotePrevious, async() => {

        try{
          await TrackPlayer.skipToPrevious()
        }catch{
          console.log('on first track')
        }
        
      });

      TrackPlayer.addEventListener(Event.RemoteDuck, async e => {
        if (e.permanent === true) {
          TrackPlayer.pause();
        } else {
          if (e.paused === true) {
            const playerState = await TrackPlayer.getState();
            wasPausedByDuck = playerState !== State.Paused;
            TrackPlayer.pause();
          } else {
            if (wasPausedByDuck === true) {
              TrackPlayer.play();
              wasPausedByDuck = false;
            }
          }
        }
      });
};