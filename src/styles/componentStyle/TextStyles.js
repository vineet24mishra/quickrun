import ColorConst from "../colors/ColorConst";
import * as Fonts from "../../assets/fonts/Fonts";


export const TextStyles = {

	textStyleDefault : {
		color : ColorConst.TEXT_COLOR_DARK,
		fontSize: 14,
		...Fonts.FONT_REGULAR
	},
	textStyleSmall : {
		color : ColorConst.TEXT_COLOR_DARK,
		fontSize: 12,
		...Fonts.FONT_REGULAR
	},
	textStyleMedium : {
		color : ColorConst.TEXT_COLOR_DARK,
		fontSize: 16,
		...Fonts.FONT_REGULAR
	},
	textStyleLarge : {
		color : ColorConst.TEXT_COLOR_DARK,
		fontSize: 18,
		...Fonts.FONT_REGULAR
	},
	textStyleHeading : {
		color : ColorConst.TEXT_COLOR_DARK,
		fontSize: 30,
		...Fonts.FONT_REGULAR
	},
	textStyleSubheading : {
		color : ColorConst.TEXT_COLOR_DARK,
		fontSize: 22,
		...Fonts.FONT_REGULAR
	}
};

