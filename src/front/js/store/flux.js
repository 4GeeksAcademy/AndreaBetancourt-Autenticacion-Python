const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			users: [],
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			getUsers: async () => {

				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/users")

					if (resp.status !== 200) alert('Error, try again');

					const data = await resp.json()
					sessionStorage.setItem('users', JSON.stringify(data))
					setStore({ 'users': data })
					
				} catch (error) {
					console.log('Error:', Error)
					alert("An error occurred. Please try again.")
				}

			},
			signup: async (email, password) => {
				const requestOptions = {
					method: "POST",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						"email": email,
						"password": password
					})
				};
			
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/register", requestOptions);
			
					if (response.status === 200) {
						const data = await response.json();
						console.log("Response from backend:", data); // Verifica la respuesta del backend en la consola
						
						// Verificar si el mensaje del backend indica que el usuario se registró con éxito y si contiene "new user"
						if (data.message === "User registered successfully" && data.hasOwnProperty("new user")) {
							// Almacenar los datos del usuario en sessionStorage
							sessionStorage.setItem('users', JSON.stringify(data['new user']));
							setStore({ users: data['new user'] });
							alert('Registration successful. You can now log in.');
						} else {
							// Manejar otros casos de respuesta
							alert('Registration failed. Please try again.');
						}
					} else {
						// Error del servidor
						alert('Registration failed. Please try again.');
					}
				} catch (error) {
					// Error de red u otro error
					console.error("Error registering user:", error);
					alert("An error occurred. Please try again.");
				}
			},			
			login: async (email, password) => {
				// 1. Definir las opciones para la solicitud POST
				const requestsOpts = {
					method: "POST",
					headers: {
						//1.1 Indicar que se espera una respuesta en formato JSON y que los datos enviados también estarán en formato JSON
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						"email": email,
						"password": password
					})
				};

				try {
					// 2. Realizar la solicitud POST al endpoint de token
					const resp = await fetch(process.env.BACKEND_URL + "/api/token", requestsOpts);

					// 2.1 Se verifica si la respuesta del servidor tiene un estado diferente de 200 y si es asi generar alerta y return False
					if (resp.status !== 200) {
						alert('There has been some error')
						return false;
					}

					//2.2 Si la respuesta del servidor tiene un estado 200, se obtiene el cuerpo de la respuesta utilizando resp.json(). 
					const data = await resp.json();
					console.log('This came form de backen', data)

					// 2.3. Se almacena el token en el sessionStorage del navegador y se actualiza el estado de la aplicación utilizando la función setStore.
					sessionStorage.setItem("token", data.token);
					setStore({ token: data.token })
					return true; //Devolver true si el inicio de sesión es exitoso

					// 3. Si en cualquier punto se produce un error, se captura el error y se muestra en la consola.
				} catch (error) {
					console.error('There has been some error!', error);
					alert("Registration failed. Please try again later.")
				}
			},

			// Se crea esta fx para sincronizar el token almacenado en el sessionStorage con el estado global de la aplicación
			syncTokenFromSessionStorage: () => {
				//1. Obtener el token del sessionStorage
				const token = sessionStorage.getItem('token')
				//1.1 Verificar si el token existe y no está vacío ni es undefined
				if (token && token != '' && typeof token != undefined) {
					// 1.2. Actualizar el estado global de la aplicación con el token
					setStore({ token: token })
				}
			},

			// Se crea esta fx para eliminar el token cuando se presiona log out en el navbar
			logout: () => {
				// Elimina el token almacenado en la session y lo reemplaza por null para tener que volver a logearse
				sessionStorage.removeItem("token");
				setStore({ token: null })

			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")

					if (resp.status === 200) {
						const data = await resp.json()
						setStore({ message: data.message })
						// don't forget to return something, that is how the async resolves
						return data;
					} else {
						console.log("Received an unexpected status code:", resp.status);
						return null;
					}
				} catch (error) {
					console.log("Error loading message from backend", error);
					throw error;
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
