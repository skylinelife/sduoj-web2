import React, {Component} from "react";
import {Button, Card, Space} from "antd";
import MApi from "../../Utils/API/m-api";
import TableWithPagination from "../../Component/common/Table/TableWithPagination";
import {withTranslation} from "react-i18next";
import {withRouter} from "react-router-dom";
import ModalFormUseForm from "../../Component/common/Form/ModalFormUseForm";
import mApi from "../../Utils/API/m-api";
import ItemTitle from "../../Component/common/Form/Item/ItemTitle";
import ItemSwitch from "../../Component/common/Form/Item/ItemSwitch";
import ItemSelectGroup from "../../Component/group/Form/Item/ItemSelectGroup";
import ItemText from "../../Component/common/Form/Item/ItemText";
import FormJudgeType from "../../Component/problem/From/FormJudgeType";

class MProblem extends Component<any, any> {
    render() {

        let colData: any[] = [
            {
                title: "ID",
                dataIndex: "problemId",
                width: 50,
                responsive: ["lg", "sm"]
            },
            {
                title: "题号",
                dataIndex: "problemCode",
                width: "auto",
                responsive: ["lg", "sm", "xs"]
            },
            {
                title: "标题",
                dataIndex: "problemTitle",
                width: "auto",
                responsive: ["lg", "sm", "xs"],
            },
            {
                title: "时间限制",
                dataIndex: "timeLimit",
                width: "auto",
                responsive: ["lg", "sm"],
                render: (text: string) => {
                    return <>{Math.floor(parseInt(text) / 1000)}s ({text}ms)</>
                }
            },
            {
                title: "内存限制",
                dataIndex: "memoryLimit",
                width: "auto",
                responsive: ["lg", "sm"],
                render: (text: string) => {
                    return <>{Math.floor(parseInt(text) / 1024)}MB ({text}KB)</>
                }
            },
            {
                title: "AC/提交",
                width: "auto",
                responsive: ["lg"],
                render: (text: string, row: any) => {
                    return <>{row.acceptNum} / {row.submitNum}</>
                }
            },
            {
                title: "来源",
                dataIndex: "source",
                width: "auto",
                responsive: ["lg"],
            },
            {
                title: "作者",
                dataIndex: "username",
                width: "auto",
                responsive: ["lg"],
            },
            {
                title: this.props.t("operator"),
                width: "auto",
                responsive: ["lg", "sm"],
                render: (text: any, rows: any) => {
                    return (
                        <Space size={3}>

                            <Button type={"link"} size={"small"}>{this.props.t("Edit")}</Button>
                            <Button type={"link"} size={"small"}>{this.props.t("Fork")}</Button>
                            <Button type={"link"} size={"small"}>{this.props.t("Description")}</Button>
                            <Button type={"link"} size={"small"}>{this.props.t("Checkpoint")}</Button>
                        </Space>
                    )
                }
            }
        ]

        const ProblemForm = [
            {
                component: (
                    <>
                        <ItemTitle name={"problemTitle"} label={"题目标题"}/>
                        <ItemSwitch name={"isPublic"} label={"公开"}/>
                        <ItemText name={"source"} label={"来源"} required={false}/>
                        <ItemSelectGroup name={"managerGroups"} label={"管理组"}
                                         mode={"multiple"}/>
                    </>
                ),
                label: "基本信息"
            },
            {
                component: (
                    <>
                        <ItemText name={"timeLimit"} label={"时间限制"} addonAfter={"ms"}
                                  initialValue={1000}/>
                        <ItemText name={"memoryLimit"} label={"空间限制"} addonAfter={"KB"}
                                  initialValue={256 * 1024}/>
                        <ItemText name={"outputLimit"} label={"输出限制"} addonAfter={"KB"}
                                  initialValue={100 * 1024}/>
                    </>
                ),
                label: "评测限制"
            },
            {
                component: (
                    <>
                        <FormJudgeType/>
                    </>
                ),
                label: "评测方式"
            },
        ]


        return (
            <div style={{marginTop: -20, overflow: "hidden"}}>
                <Card size={"small"} bordered={false} title={"题目列表"} extra={
                    <>
                        <ModalFormUseForm
                            TableName={"ProblemList"}
                            width={600}
                            title={"新建题目"}
                            type={"create"}
                            subForm={ProblemForm}
                            dataSubmitter={(value: any) => {
                                value.isPublic = (value.isPublic ? 1 : 0)
                                const functionTemplates = []
                                if (value.functionTemplates !== undefined) {
                                    for (const x in value.functionTemplates) {
                                        functionTemplates.push({
                                            ...value.functionTemplates[x],
                                            isShowFunctionTemplate: value.functionTemplates[x].isShowFunctionTemplate ? 1 : 0
                                        })
                                    }
                                }
                                return mApi.createProblem(value)
                            }}
                        />
                    </>
                }
                >
                    <TableWithPagination
                        columns={colData}
                        API={MApi.getProblemList}
                        size={"small"}
                        name={"ProblemList"}
                        rowKey={"problemId"}
                    />
                </Card>
            </div>
        )
    }
}

export default withTranslation()(withRouter(MProblem))