require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '15.1'
install! 'cocoapods', :deterministic_uuids => false

# Prepare React Native project
prepare_react_native_project!

# Flipper configuration
flipper_config = ENV['NO_FLIPPER'] == "1" ? FlipperConfiguration.disabled : FlipperConfiguration.enabled

linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

target 'mobile' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    # Hermes is now enabled by default.
    :hermes_enabled => true,
    :fabric_enabled => false,
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/..",
    # Flipper configuration
    :flipper_configuration => flipper_config
  )

  target 'mobileTests' do
    inherit! :complete
    # Pods for testing
  end

  post_install do |installer|
    # https://github.com/facebook/react-native/blob/main/packages/react-native/scripts/react_native_pods.rb#L197-L202
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false
    )
    
    # Fix for Xcode 16 and React Native 0.76+
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'
        
        # Disable bitcode
        config.build_settings['ENABLE_BITCODE'] = 'NO'
        
        # Swift version
        config.build_settings['SWIFT_VERSION'] = '5.0'
        
        # Fix for Xcode 16
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'RCT_NEW_ARCH_ENABLED=0'
        
        # Enable dead code stripping
        config.build_settings['DEAD_CODE_STRIPPING'] = 'YES'
      end
    end
  end
end
