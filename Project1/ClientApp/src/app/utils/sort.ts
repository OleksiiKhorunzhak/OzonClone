export class Sort {

    private sortOrder = 1;
    private collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
    });


    constructor() {
    }

    public startSort(property: any, order: string, type = "") {
        if (order === "desc") {
            this.sortOrder = -1;
        }
        return (a:any, b:any) => {
            if (type === "date") {
                var temp = this.sortData(a[property] ? new Date(a[property]) : '', b[property] ? new Date(b[property]) : '');
                return temp;
            }
            if(type == "value-color"){
                return this.collator.compare(a[property].name ?? '', b[property].name ?? '') * this.sortOrder;
            }
            else {
                return this.collator.compare(a[property], b[property]) * this.sortOrder;
            }
        }
    }

    private sortData(a:any, b:any) {
        if (a < b) {
            return -1 * this.sortOrder;
        } else if (a > b) {
            return 1 * this.sortOrder;
        } else {
            return 0 * this.sortOrder;
        }
    }
}