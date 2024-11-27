import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

export default function TabsDefault() {

    function handleTabChange(value: string) {
        console.log(value);
    }

    const data = [
        {
            label: "Svk easy",
            value: "svkE",
            desc: `Slovensko easy`,
        },
        {
            label: "Svk hard",
            value: "svkH",
            desc: `Slovensko hard`,
        },
        {
            label: "Svet",
            value: "world",
            desc: `Svet`,
        },

    ];

    return (
        <Tabs value="html">
            <TabsHeader >
                {data.map(({ label, value }) => (
                    <Tab key={value} value={value} onClick={() => handleTabChange(value)}>
                        {label}
                    </Tab>
                ))}
            </TabsHeader>
        </Tabs>
    );
}