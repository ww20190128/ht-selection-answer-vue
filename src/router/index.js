import { RouterView, createRouter, createWebHistory } from "vue-router";
import { createRouterGuards } from "./routerGuards";
import qs from "qs";
import { useAgent } from "@/hooks/useAgent";
import { getToken } from "@/utils/auth";
import { store } from "@/store";
const { isWeChat } = useAgent();

function authBeforeEnter(to, from, next, path) {
  const { code } = to.query;
  // 逻辑同 我的评测
  if (isWeChat) {
    if (code) {
      next();
    } else {
      if (!getToken()) {
        const search = qs.stringify(to.query);
        store.dispatch("user/auth", {
          authType: 1,
          redirectUrl: `${window.location.origin}${path}?${search}`,
        });
      } else {
        next();
      }
    }
  } else {
    next();
  }
}
/* 
meta 参数说明
showTabBar : 是否显示底部导航栏 true显示  false或不填隐藏
backTopHidden : 是否隐藏返回顶部按钮 true隐藏 false或不填显示
*/
export const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/home",
    component: () => import("@/layout/index"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/index"),
        meta: {
          title: "首页",
          showTabBar: true,
        },
      },
      {
        path: "/login",
        name: "login",
        component: () => import("@/views/user/login"),
        meta: {
          title: "登录",
          showTabBar: false,
        },
      },
      {
        path: "/pk",
        name: "contentGroup",
        component: () => import("@/views/home/pk"),
        meta: {
          title: "题目投票",
          showTabBar: false,
        },
      },
      {
        path: "/answer",
        name: "answer",
        component: () => import("@/views/home/answer"),
        meta: {
          title: "答题",
          showTabBar: false,
        },
      },
      {
        path: "/userPK",
        name: "userPK",
        component: () => import("@/views/user/userPK"),
        meta: {
          title: "我的",
          showTabBar: true,
        },
      },
      {
        path: "/introduce",
        name: "introduce",
        component: () => import("@/views/introduce/index"),
        meta: {
          title: "活动规则",
          showTabBar: true,
        },
      },

      {
        path: "/suggest",
        name: "suggest",
        component: () => import("@/views/introduce/suggest"),
        meta: {
          title: "投诉建议",
          showTabBar: true,
        },
      },
      {
        path: "/user",
        name: "user",
        component: () => import("@/views/user/index"),
        meta: {
          title: "个人中心",
          showTabBar: true,
        },
        beforeEnter: async (to, from, next) => {
          const { code } = to.query;
          // 微信环境下做跳转拦截
          if (isWeChat) {
            // 授权回调过来带有code 进入路由
            // if (code) {
            //   next()
            // } else {
            //   // 未登录 或者未弹窗授权 跳转授权页
            //   if (!getToken() || !store.getters.userInfo.headimgurl) {
            //     await store.dispatch("user/auth", {
            //       auth_type: 2,
            //       self_redirect: `${window.location.origin}/user`
            //     });
            //   } else {
            //     next()
            //   }

            // }
            next();
          } else {
            store.commit("app/SET_WECHATQRSHOW", true);
            next(from.fullPath);
          }
        },
      },
    ],
  },
  // 404 直接重定向到首页
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home",
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* 路由异常错误处理，尝试解析一个异步组件时发生错误，重新渲染目标页面 */
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  // const targetPath = router.history.pending.fullPath;
  const targetPath = router.history.pending
    ? router.history.pending.fullPath
    : "";
  if (isChunkLoadFailed && targetPath) {
    router.replace(targetPath);
  }
});

export const setupRouter = (app) => {
  app.use(router);
  createRouterGuards(router);
};
