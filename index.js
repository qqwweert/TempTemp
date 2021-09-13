const vue = Vue.createApp({
    data() {
        const date = new Date().toISOString().slice(0, 10);
        const data = JSON.parse(localStorage["data"] || JSON.stringify({
            people: [], actions: [], table: {} }));
        people = data.people;
        actions = data.actions;
        table = data.table;
        table[date] = table[date] || Object.fromEntries(
            people.map(i => [i, {$: ""}]));
        return { people, actions, table, date, current: null };
    },
    methods: {
        updateData() {
            const people = this.people;
            this.table = {
                [this.date]: Object.fromEntries(people.map(i => [i, {$: ""}]))
            };
        },
        saveData() {
            localStorage["data"] = JSON.stringify({
                people: this.people,
                actions: this.actions,
                table: this.table,
            });
        },
        download() {
            const blob = new Blob([localStorage["data"]]);
            const a = document.createElement("a");
            a.setAttribute("download", "data.json");
            a.setAttribute("href", URL.createObjectURL(blob)); 
            a.click();
        },
        async upload() {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.click();
            await new Promise(r => { input.onchange = () => r() });
            localStorage["data"] = await input.files[0].text();
            location.reload();
        },
    },
    computed: {
        peopleText: {
            get() {
                return this.people.join("\n");
            },
            set(val) {
                this.people = val.split("\n");
                this.updateData();
            },
        },
        actionsText: {
            get() {
                return this.actions.join("\n");
            },
            set(val) {
                this.actions = val.split("\n");
                this.updateData();
            },
        },
    },
    watch: {
        people: 'saveData',
        actions: 'saveData',
        table: { handler: 'saveData', deep: true },
        date(date) {
            this.table[date] = this.table[date] || Object.fromEntries(
                this.people.map(i => [i, {$: ""}]));
        },
    },
}).mount("#app");;
