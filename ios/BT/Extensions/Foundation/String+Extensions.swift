import Foundation

extension String {
  static let `default` = ""
  static let notAuthorized = "notAuthorized"
  static let authorized = "authorized"
  static let keyPathTestResults = "testResults"
  static let keyPathExposureDetectionErrorLocalizedDescription = "exposureDetectionErrorLocalizedDescription"
  static let keyPathDateLastPerformedExposureDetection = "dateLastPerformedExposureDetection"
  static let keyPathExposures = "exposures"
  static let postKeysUrl = "POST_DIAGNOSIS_KEYS_URL"
  static let downloadKeyFile = "DOWNLOAD_KEY_FILE_URL"
  static let indexFileUrl = "INDEX_FILE_URL"
  static let bluetoothNotificationTitle = "Bluetooth Off"
  static let bluetoothNotificationBody = "You must enable bluetooth to receive Exposure Notifications."
  static let bluetoothNotificationIdentifier = "bluetooth-off"
  static let genericSuccess = "success"

  var gaenFilePaths: [String] {
    split(separator: "\n").map { String($0) }
  }

  var localized: String {
    NSLocalizedString(self, comment: .default)
  }

}
