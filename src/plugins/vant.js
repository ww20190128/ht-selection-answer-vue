
import {
    Button,
    Tabbar,
    TabbarItem,
    Icon,
    Field,
    Swipe,
    SwipeItem,
    Sidebar,
    SidebarItem,
    DropdownMenu,
    DropdownItem,
    Progress,
    CountDown,
    Dialog,
    Loading,
    Popup,
    Col,
    Row,
    Rate,
    Tab,
    Tabs,
    Overlay,
    Lazyload,
    Image as VanImage,
    Toast,
    Skeleton,
    Sticky,
    Notify,
    Picker,
    Empty,
	Slider,
	Pagination
} from 'vant'

const plugins = [
    Button,
    Tabbar,
    TabbarItem,
    Icon,
    Field,
    Swipe,
    SwipeItem,
    Sidebar,
    SidebarItem,
    DropdownMenu,
    DropdownItem,
    Progress,
    CountDown,
    Dialog,
    Loading,
    Popup,
    Col,
    Row,
    Rate,
    Tab,
    Tabs,
    Overlay,
    Lazyload,
    VanImage,
    Skeleton,
    Sticky,
    Notify,
    Picker,
    Empty,
    Slider,
	Pagination
]

import icon from "@/assets/images/loading-img.gif"
export const loadingToast = (message = "加载中...") => {
    Toast.allowMultiple();
    return Toast.loading({
        message,
        forbidClick: true,
        duration: 0,
        overlay: true,
        overlayStyle: {
            background: 'transparent'
        },
        icon,
    });
}

export const setupVantPlugins = (app) => {

    plugins.forEach((item) => {
        app.use(item)
    })

}