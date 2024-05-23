<template>
    <div :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
        <logo v-if="showLogo"/>
        <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
            <el-menu
                :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
                :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
                :unique-opened="true"
                :active-text-color="settings.theme"
                :collapse-transition="false"
                mode="vertical"
                router
                style="color: white !important;"
            >
            <div v-if="isAdmin">
                <el-menu-item index="/index">
                    <i class="el-icon-s-home"></i>
                    <span>首页</span>
                </el-menu-item>
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-upload2"></i>
                        <span>数据上传</span>
                    </template>
                    <el-menu-item index="/data/bookUpload">
                        <template slot="title">
                            <span>书籍上传</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/data/wordUpload">
                        <template slot="title">
                            <span>文档上传</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/data/videoUpload">
                        <template slot="title">
                            <span>视频上传</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-document-copy"></i>
                        <span>数据分配</span>
                    </template>
                    <el-submenu index="3-1">
                        <template slot="title">媒体数据</template>
                        <el-menu-item index="3-1-1">全部</el-menu-item>
                        <el-menu-item index="3-1-2">舰船</el-menu-item>
                        <el-menu-item index="3-1-3">飞行器</el-menu-item>
                        <el-menu-item index="3-1-4">雷达</el-menu-item>
                        <el-submenu index="3-1-5">
                            <template slot="title">固定目标</template>
                            <el-menu-item index="3-1-5-1">基地</el-menu-item>
                            <el-menu-item index="3-1-5-2">电厂</el-menu-item>
                            <el-menu-item index="3-1-5-3">机场</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="3-2">相似数据</el-menu-item>
                    <el-submenu index="3-3">
                        <template slot="title">无类别数据</template>
                        <el-menu-item index="3-3-1">噪音数据</el-menu-item>
                        <el-menu-item index="3-3-2">我方数据</el-menu-item>
                        <el-menu-item index="3-3-3">其它数据</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="3-4">丢弃数据</el-menu-item>
                    <el-submenu index="3-5">
                        <template slot="title">百科数据</template>
                        <el-menu-item index="3-5-1">全部</el-menu-item>
                        <el-menu-item index="3-5-2">舰船</el-menu-item>
                        <el-menu-item index="3-5-3">飞行器</el-menu-item>
                        <el-menu-item index="3-5-4">雷达</el-menu-item>
                        <el-submenu index="3-5-5">
                            <template slot="title">固定目标</template>
                            <el-menu-item index="3-5-5-1">基地</el-menu-item>
                            <el-menu-item index="3-5-5-2">电厂</el-menu-item>
                            <el-menu-item index="3-5-5-3">机场</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-submenu index="3-6">
                        <template slot="title">文档数据</template>
                        <el-menu-item index="3-6-1">全部</el-menu-item>
                        <el-menu-item index="3-6-2">舰船</el-menu-item>
                        <el-menu-item index="3-6-3">飞行器</el-menu-item>
                        <el-menu-item index="3-6-4">雷达</el-menu-item>
                        <el-submenu index="3-6-5">
                            <template slot="title">固定目标</template>
                            <el-menu-item index="3-6-5-1">基地</el-menu-item>
                            <el-menu-item index="3-6-5-2">电厂</el-menu-item>
                            <el-menu-item index="3-6-5-3">机场</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-loading"></i>
                        <span>数据审核</span>
                    </template>
                    <el-submenu index="4-1">
                        <template slot="title">媒体数据</template>
                        <el-menu-item index="4-1-1">全部</el-menu-item>
                        <el-menu-item index="4-1-2">舰船</el-menu-item>
                        <el-menu-item index="4-1-3">飞行器</el-menu-item>
                        <el-menu-item index="4-1-4">雷达</el-menu-item>
                        <el-submenu index="4-1-5">
                            <template slot="title">固定目标</template>
                            <el-menu-item index="4-1-5-1">基地</el-menu-item>
                            <el-menu-item index="4-1-5-2">电厂</el-menu-item>
                            <el-menu-item index="4-1-5-3">机场</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-submenu index="4-2">
                        <template slot="title">百科数据</template>
                        <el-menu-item index="4-2-1">全部</el-menu-item>
                        <el-menu-item index="4-2-2">舰船</el-menu-item>
                        <el-menu-item index="4-2-3">飞行器</el-menu-item>
                        <el-menu-item index="4-2-4">雷达</el-menu-item>
                        <el-submenu index="4-2-5">
                            <template slot="title">固定目标</template>
                            <el-menu-item index="4-2-5-1">基地</el-menu-item>
                            <el-menu-item index="4-2-5-2">电厂</el-menu-item>
                            <el-menu-item index="4-2-5-3">机场</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-submenu index="4-3">
                        <template slot="title">文档数据</template>
                        <el-menu-item index="4-3-1">全部</el-menu-item>
                        <el-menu-item index="4-3-2">舰船</el-menu-item>
                        <el-menu-item index="4-3-3">飞行器</el-menu-item>
                        <el-menu-item index="4-3-4">雷达</el-menu-item>
                        <el-submenu index="4-3-5">
                            <template slot="title">固定目标</template>
                            <el-menu-item index="4-3-5-1">基地</el-menu-item>
                            <el-menu-item index="4-3-5-2">电厂</el-menu-item>
                            <el-menu-item index="4-3-5-3">机场</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="4-4">
                        <template slot="title">
                            <span>全网端数据</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index= 5>
                    <template slot="title">
                        <i class="el-icon-share"></i>
                        <span>图谱数据管理</span>
                    </template>
                    <el-menu-item index="5-1">
                        <span>实例管理</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item index="/user/admin">
                    <i class="el-icon-user"></i>
                    <span>用户管理</span>
                </el-menu-item>
            </div>
            <div v-else>
                <template v-for="item in filteredMenuItems">
                    <el-submenu v-if="item.children" :key="`submenu-${item.route}`" :index="item.route">
                        <template slot="title"><i :class="item.icon"></i>{{ item.name }}</template>
                        <el-menu-item 
                        v-for="child in item.children" 
                        :key="`menu-${child.route}`" 
                        :index="child.route">
                        <router-link :to="child.route">{{ child.name }}</router-link>
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item v-else :key="`menu-${item.route}`" :index="item.route">
                        <router-link :to="item.route"><i :class="item.icon"></i>{{ item.name }}</router-link>
                    </el-menu-item>
                </template>
            </div>
            </el-menu>
        </el-scrollbar>
    </div>
</template>
<style scoped>
.el-menu-item i,.el-submenu__title i{
    color: white;
}
.el-submenu__title span{
    color: white;
}
.el-menu-item{
    color: white !important;
    background-color: rgba(1, 84, 120, 1) !important;
}   
.el-submenu{
    .el-submenu__title{
        background-color: rgba(1, 84, 120, 1) !important;
    }
    .el-menu-item{
        padding-left: 60px !important;
        background-color: rgba(7,65,90,1) !important;
    }
}
.is-active{
    color: rgb(64, 158, 255) !important;
}
.el-submenu {
    .el-menu{
        .el-submenu__title{
            color: white !important;
            padding-left: 60px !important;
        }
        
    }
}
.el-submenu{
    .el-submenu{
        .el-submenu__title{
            background-color: rgba(7,65,90,1) !important;
        }
        .el-menu-item{
            padding-left: 80px !important;
            background-color: rgba(8,50,68,1) !important;
        }
        .el-submenu{
            .el-submenu__title{
                padding-left: 80px !important;
                background-color: rgba(8,50,68,1) !important;
            }
            .el-menu-item{
                padding-left: 100px !important;
                background-color: rgba(4,28,38,1) !important;
            }
        }
    }
}
</style>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
    mounted(){
        console.log(this.roles)
        if(this.roles == 0){
            this.$store.dispatch("ChangeRoles", false).then(() => {
                }).catch(() => {
            });    
        }
    },
    data(){
        return{
            menuItems: [
                { name: '首页', route: '/index', roles: ['user'],icon:"el-icon-s-home" },
                { name: '实例数据', route: '/users', roles: ['user'], icon:"el-icon-document-copy"},
                { name: '个人详情', route: '/settings', roles: ['user'] , icon:"el-icon-user"},
                // 其他菜单项
            ],
            userRole: 'user', // 示例角色，实际应用中应从后端或Vuex中获取，
        }
    },
    components: { SidebarItem, Logo },
    computed: {
        ...mapState(["settings"]),
        ...mapGetters(["sidebarRouters", "sidebar",'isAdmin','roles']),
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        },
        variables() {
            return variables;
        },
        filteredMenuItems() {
            const filterMenu = (menu) => {
                return menu
                .filter(item => item.roles.includes(this.userRole))
                .map(item => {
                    if (item.children) {
                    const filteredChildren = filterMenu(item.children);
                    if (filteredChildren.length > 0) {
                        return { ...item, children: filteredChildren };
                    }
                    }
                    return item;
                });
            };

            return filterMenu(this.menuItems);
        }
    }
};
</script>
