import LedBar from "./LedBar";
import { useDmxButtonsContext } from "../../contexts/DmxButtonsContext";
import { useRealTimeContext } from "../../contexts/RealTimeContext";


const DmxScene = () => {
    const { dmxButtons, selectedDmxButtonId, ledBarConfigs } = useDmxButtonsContext()
    const { dmxHexSignal } = useRealTimeContext()

    const { updateDmxButtonAndSync } = useDmxButtonsContext()

    const selectedRedChannels = dmxButtons.find(({id}) => selectedDmxButtonId == id)?.red_channels || []

    const onSelectRedChannels = (redChannels: number[], selected: boolean) => {
      if(!selectedDmxButtonId) return

      if(selected) {
        updateDmxButtonAndSync(selectedDmxButtonId, {red_channels: [...new Set([...selectedRedChannels, ...redChannels])]})
      }
      else {
        updateDmxButtonAndSync(selectedDmxButtonId, {red_channels: selectedRedChannels.filter(channel => redChannels.indexOf(channel) == -1)})
      }
    }

    return <div>
      { ledBarConfigs.map(ledBarConfig => (
          <LedBar
            dmxHexSignal={dmxHexSignal}
            size={ledBarConfig.rgbDotsCount}
            channel={ledBarConfig.channel}
            selectedRedChannels={selectedRedChannels}
            onSelectRedChannels={onSelectRedChannels}/>
      ))}
      
    </div>
}

export default DmxScene
