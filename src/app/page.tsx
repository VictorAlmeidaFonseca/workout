"use client"

import { Collapse, CollapseProps, Table, Switch } from "antd"
const { Column, ColumnGroup } = Table

import { makeWorkout, Workout } from "@/infra/workout"
import { useEffect, useState } from "react"
import { AnyObject } from "antd/es/_util/type"


export default function Home() {
    const [workout, setWorkout] = useState<any[]>([])

    const fetchWorkout = async () => {
        const workout = makeWorkout()
        const toSet = Array.from({ length: 15 }, (_, i) => {
            const index = i + 1
            const filterByIndex = workout.filter((w) => w.week === index)

            const daysOfWeek: { [key: string]: any[] } = {
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Saturday: [],
            }
            filterByIndex.forEach((w) => {
                daysOfWeek[w.weekDay].push({
                    key: daysOfWeek[w.weekDay].length,
                    exercise: w.exercise,
                    series: w.series,
                    repetitions: w.repetitions,
                    rest: w.rest,
                    kg: w.kg,
                    done: w.done,
                })
            })

            console.log("daysOfWeek", daysOfWeek)
            return daysOfWeek

         
        })

        setWorkout(toSet)
    }

    useEffect(() => {
        const init = async () => {
            await fetchWorkout()
        }

        init()
            .then((_) => console.log("Workout loaded"))
            .catch(console.error)
    }, [])

        const handleDoneChange = (checked: boolean, record: AnyObject, weekIndex: number | undefined, dayKey: string | number | undefined) => {
            console.log("Checked:", checked, "Record:", record)
        
            setWorkout((currentWorkout) => {
                return currentWorkout.map((week, index) => {
                    if (index === weekIndex && dayKey !== undefined) {
                        const newWeek = { ...week } 
                        newWeek[dayKey] = newWeek[dayKey].map((item: { key: any }) => {
                            if (item.key === record.key) {
                                return { ...item, done: checked } 
                            }
                            return item
                        })
                        return newWeek
                    }
                    return week
                })
            })
        }


    const items: CollapseProps["items"] = workout.map((w, index) => {
        const label = `Week ${index + 1}`
        return {
            key: `week-${index}`,
            label,
            children: Object.entries(w).map(([key, value], dayIndex) => (
                <Table dataSource={value as readonly Object[]} pagination={false} key={`day-${index}-${dayIndex}`}>
                    <ColumnGroup title={key}>
                        <Column title="Exercise" dataIndex="exercise" key="exercise" />
                        <Column title="Series" dataIndex="series" key="series" />
                        <Column title="Repetitions" dataIndex="repetitions" key="repetitions" />
                        <Column title="Rest" dataIndex="rest" key="rest" />
                        <Column title="Kg" dataIndex="kg" key="kg" />
                        <Column
                            title="Done"
                            dataIndex="done"
                            key="done"
                            render={(done, record) => (
                                <Switch
                                    checked={done}
                                    onChange={(checked) => handleDoneChange(checked, record, index, key)}
                                />
                            )}
                        />
                    </ColumnGroup>
                </Table>
            )),
        }
    })


    return (
        <main className={""}>
            <h2>100 Days Challenge - Gym Workout</h2>
            <Collapse items={items} defaultActiveKey={["1"]} />
        </main>
    )
}
