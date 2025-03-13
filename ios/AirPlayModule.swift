import React
import MediaPlayer
import AVFoundation

@objc(AirPlayModule)
class AirPlayModule: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool {
    return true  // Ensure module runs on the main thread
  }

  @objc func showAirPlayPicker() {
    DispatchQueue.main.async {
      let volumeView = MPVolumeView()
      volumeView.showsRouteButton = true
      volumeView.isHidden = false
      if let keyWindow = UIApplication.shared.keyWindow {
        keyWindow.rootViewController?.view.addSubview(volumeView)
        volumeView.frame = CGRect(x: -1000, y: -1000, width: 0, height: 0) // Hide the button
      }
    }
  }
}
