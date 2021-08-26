import React, {Component} from "react";

import {IUser, IUserPropRoles, Role, Sex} from '../../Type/Iuser'
import {Button, Space, Table, TablePaginationConfig, Tag, Tooltip} from "antd";
import {withTranslation} from "react-i18next";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {FilterValue, SorterResult, TableCurrentDataSource} from "antd/lib/table/interface";
import {ManOutlined, QuestionOutlined, WomanOutlined} from "@ant-design/icons"
import DeleteUser from "./DeleteUser";


interface IUserListState {
    userList: IUser[]
    loading: boolean
    total: number
    showCol: object
    selectedRowKeys: any[]
}

interface IUserListCol {
    title_i18n: string
    dataIndex: string,
    render: any
    width: number | string
}

const colData: IUserListCol[] = [
    {
        title_i18n: "#",
        dataIndex: "id",
        render: null,
        width: 50
    },
    {
        title_i18n: "username",
        dataIndex: "username",
        width: "auto",
        render: (str: string) => {
            return (
                <Tooltip placement="topLeft" title={str}>
                    {str}
                </Tooltip>
            )
        }
    },
    {
        title_i18n: "nickname",
        dataIndex: "nickname",
        width: 100,
        render: (str: string) => {
            return (
                <Tooltip placement="topLeft" title={str}>
                    {str}
                </Tooltip>
            )
        }
    },
    {
        title_i18n: "sex",
        dataIndex: "sex",
        width: 50,
        render: (sex: Sex) => {
            switch (sex) {
                case Sex.Male:
                    return <ManOutlined/>
                case Sex.Female:
                    return <WomanOutlined/>
                case Sex.Unknown:
                    return <QuestionOutlined/>
            }
        }
    },
    {
        title_i18n: "student_id",
        dataIndex: "student_id",
        width: "auto",
        render: (str: string) => {
            return (
                <Tooltip placement="topLeft" title={str}>
                    {str}
                </Tooltip>
            )
        }
    },
    {
        title_i18n: "sdu_id",
        dataIndex: "sdu_id",
        width: "auto",
        render: (str: string) => {
            return (
                <Tooltip placement="topLeft" title={str}>
                    {str}
                </Tooltip>
            )
        }
    },
    {
        title_i18n: "email",
        dataIndex: "email",
        width: "auto",
        render: (str: string) => {
            return (
                <Tooltip placement="topLeft" title={str}>
                    {str}
                </Tooltip>
            )
        }
    }
]


class UserList extends Component<IUserPropRoles & RouteComponentProps, IUserListState> {

    constructor(props: IUserPropRoles & RouteComponentProps, context: any) {
        super(props, context);
        let userList: IUser[] = []
        for (let i = 1; i < 200; i++) {
            userList.push({
                id: i*100,
                username: "yhf2000",
                nickname: "尹浩飞",
                sex: (i % 3),
                roles: [i % 3, (i + 1) % 3],
                student_id: "201805130160",
                sdu_id: "201805130160",
                email: "735961159@qq.com"
            })
        }
        this.state = {
            userList: userList,
            loading: false,
            total: 199,
            showCol: {},
            selectedRowKeys: []
        }
        this.showTotal = this.showTotal.bind(this)
    }

    deleteUser = (ids: number[]) => {
        this.setState((state) => {
            return {
                userList: state.userList.filter(user => !ids.includes(user.id)),
                total: state.total - ids.length,
                selectedRowKeys: state.selectedRowKeys.filter(id => !ids.includes(id))
            }
        })

    }

    showTotal(total: number) {
        return this.props.t("total") + " " + total.toString() + " " + this.props.t("item")
    }

    tableChange(pagination: TablePaginationConfig,
                filters: Record<string, FilterValue | null>,
                sorter: SorterResult<IUser> | SorterResult<any>[],
                extra: TableCurrentDataSource<any>): void {


    }

    componentDidMount() {
        this.props.obj && this.props.obj(this, this.state.selectedRowKeys)
    }

    shouldComponentUpdate(nextProps: Readonly<IUserPropRoles & RouteComponentProps>, nextState: Readonly<IUserListState>, nextContext: any): boolean {
        if (nextState !== this.state) {
            this.props.obj && this.props.obj(this, nextState.selectedRowKeys)
            return true
        }
        return false
    }

    render() {
        const {selectedRowKeys} = this.state;
        let rowSelection: any = {
            selectedRowKeys,
            onChange: (selectedRowKeys: React.Key[], selectedRows: IUser[]) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({selectedRowKeys});
            },
            selections: [
                {
                    key: 'all',
                    text: this.props.t("selectedAll"),
                    onSelect: (changeableRowKeys: any[]) => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changeableRowKeys
                        newSelectedRowKeys = newSelectedRowKeys.concat(this.state.selectedRowKeys.filter((key, index) => {
                            return !changeableRowKeys.includes(key);
                        }))
                        this.setState({selectedRowKeys: newSelectedRowKeys});
                    },
                },
                {
                    key: 'clear',
                    text: this.props.t("clear"),
                    onSelect: (changeableRowKeys: any[]) => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = this.state.selectedRowKeys.filter((key, index) => {
                            return !changeableRowKeys.includes(key);
                        })
                        this.setState({selectedRowKeys: newSelectedRowKeys});
                    },
                },
                {
                    key: 'invert',
                    text: this.props.t("invert"),
                    onSelect: (changeableRowKeys: any[]) => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changeableRowKeys.filter((key, index) => {
                            return !this.state.selectedRowKeys.includes(key);
                        });
                        newSelectedRowKeys = newSelectedRowKeys.concat(this.state.selectedRowKeys.filter((key, index) => {
                            return !changeableRowKeys.includes(key);
                        }))
                        this.setState({selectedRowKeys: newSelectedRowKeys});
                    },
                },

            ]
        };
        if (!this.props.roles.includes(Role.SuperAdmin)) {
            rowSelection = undefined
        }

        return (
            <>
                <Table dataSource={this.state.userList}
                       rowKey='id'
                       loading={this.state.loading}
                       size={"small"}
                       onChange={this.tableChange}
                       pagination={{
                           size: "small", total: this.state.total,
                           showSizeChanger: true,
                           showQuickJumper: true,
                           showTotal: this.showTotal,
                       }}
                       rowSelection={rowSelection}

                >
                    {
                        colData.map((r, i) => {
                            return (
                                <Table.Column
                                    title={this.props.t(r.title_i18n)}
                                    width={r.width}
                                    align={"center"}
                                    dataIndex={r.dataIndex}
                                    ellipsis={{showTitle: false}}
                                    render={r.render}
                                />
                            )
                        })
                    }

                    <Table.Column
                        title={this.props.t("roles")}
                        width={"auto"}
                        align={"center"}
                        dataIndex="roles"
                        render={
                            (roles: Role[]) => (
                                roles.map((r) => {
                                    if (r === Role.SuperAdmin)
                                        return <Tag color="error">{this.props.t("superadmin")}</Tag>
                                    if (r === Role.Admin)
                                        return <Tag color="warning">{this.props.t("admin")}</Tag>
                                    if (r === Role.User)
                                        return <Tag color="default">{this.props.t("user")}</Tag>
                                    return <></>
                                })
                            )}/>
                    <Table.Column
                        title={this.props.t("operator")}
                        width={120}
                        align={"center"}
                        render={(user: IUser) => (
                            <Space>
                                <Button size={"small"} type='primary'>编辑</Button>
                                {
                                    [''].map(() => {
                                        if (this.props.roles.includes(Role.SuperAdmin))
                                            return <DeleteUser btSize={"small"} callback={this.deleteUser} ids={[user.id]}/>
                                        return <></>
                                    })
                                }
                            </Space>
                        )}/>
                </Table>
            </>
        )
    }
}

export default withTranslation()(withRouter(UserList))