import { debounce } from "lodash";
import React from "react";
import { TouchableOpacity, Text } from "react-native";

export const withPreventDoubleClick = (WrappedComponent) => {

  class PreventDoubleClick extends React.PureComponent {

    debouncedOnPress = () => {
      this.props.onPress && this.props.onPress();
    }

    onPress = debounce(this.debouncedOnPress, 500, { leading: true, trailing: false });

    render() {
      return <WrappedComponent {...this.props} onPress={this.onPress} />;
    }
  }

  PreventDoubleClick.displayName = `withPreventDoubleClick(${WrappedComponent.displayName || WrappedComponent.name})`;
  return PreventDoubleClick;
};

export const TouchableOpacityDoubleClick = withPreventDoubleClick(TouchableOpacity);
export const TextDoubleClick = withPreventDoubleClick(Text);

