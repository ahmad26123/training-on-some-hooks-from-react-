// export class BaiseApi {
//     constructor(url) {
//         this.baseUrl = url;
//     }
    //=====================================================================
    const getAll = async (name) => {
        try {
            // const response = await fetch(this.baseUrl);
            const response = await fetch(`https://jsonplaceholder.typicode.com/${name}`);

            if (!response.ok) {
                throw new Error("rong :", response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Error", error.message);
        }
    };
    //=====================================================================
    const post = async (name,data) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/${name}`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("ERROR : ", response.status);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("ronnng : ", error.message);
        }
    };
    //=====================================================================
    const getById = async (name , id) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/${name}/${id}`);
            if (!response.ok) {
                throw new Error("rong :", response.status);
            }
            return await response.json();
        } catch (erorr) {
            console.error(erorr)
        }
    }
    //=====================================================================
    const update = async (name , id, data) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/${name}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("ERROR : ", response.status);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("ronnng : ", error.message);
        }
    };
    //=====================================================================
    const deleted = async (name , id) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/${name}/${id}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error("rong :", response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Error", error.message);
        }
    };
// }