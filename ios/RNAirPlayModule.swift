import Foundation
import AVKit
import React

@objc(RNAirPlayModule)
class RNAirPlayModule: NSObject, RCTBridgeModule {
  
  static func moduleName() -> String {
    return "RNAirPlayModule"
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc func showAirPlayPicker() {
    DispatchQueue.main.async {
      // Ensure this code runs on the main thread
      if let window = UIApplication.shared.windows.first {
        let routePickerView = AVRoutePickerView()
        routePickerView.activeTintColor = UIColor.blue
        routePickerView.frame = CGRect(x: 0, y: 0, width: 44, height: 44)
        
        // Make sure to trigger the button action
        for subview in routePickerView.subviews {
          if let button = subview as? UIButton {
            button.sendActions(for: .touchUpInside)
            break
          }
        }

        window.rootViewController?.view.addSubview(routePickerView)
      }
    }
  }
}
