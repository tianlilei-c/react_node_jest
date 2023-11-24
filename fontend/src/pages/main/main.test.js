import React from 'react';
import { render, fireEvent, act, screen, waitFor, getByPlaceholderText, getByText } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import fetchMock from 'jest-fetch-mock';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';

import Main from './main.js';

const mockStore = configureStore([]);

describe('<Main />', () => {
    let store;
    const postData = [
        {
            "userId": 1,
            "id": 10,
            "title": "optio molestias id quia eum",
            "body": "quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error"
        },
        {
            "userId": 2,
            "id": 20,
            "title": "doloribus ad provident suscipit at",
            "body": "qui consequuntur ducimus possimus quisquam amet similique\nsuscipit porro ipsam amet\neos veritatis officiis exercitationem vel fugit aut necessitatibus totam\nomnis rerum consequatur expedita quidem cumque explicabo"
        },
        {
            "userId": 3,
            "id": 28,
            "title": "delectus ullam et corporis nulla voluptas sequi",
            "body": "non et quaerat ex quae ad maiores\nmaiores recusandae totam aut blanditiis mollitia quas illo\nut voluptatibus voluptatem\nsimilique nostrum eum"
        },
        {
            "userId": 3,
            "id": 29,
            "title": "iusto eius quod necessitatibus culpa ea",
            "body": "odit magnam ut saepe sed non qui\ntempora atque nihil\naccusamus illum doloribus illo dolor\neligendi repudiandae odit magni similique sed cum maiores"
        },
        {
            "userId": 4,
            "id": 40,
            "title": "enim quo cumque",
            "body": "ut voluptatum aliquid illo tenetur nemo sequi quo facilis\nipsum rem optio mollitia quas\nvoluptatem eum voluptas qui\nunde omnis voluptatem iure quasi maxime voluptas nam"
        },
        {
            "userId": 5,
            "id": 41,
            "title": "non est facere",
            "body": "molestias id nostrum\nexcepturi molestiae dolore omnis repellendus quaerat saepe\nconsectetur iste quaerat tenetur asperiores accusamus ex ut\nnam quidem est ducimus sunt debitis saepe"
        },
        {
            "userId": 5,
            "id": 42,
            "title": "commodi ullam sint et excepturi error explicabo praesentium voluptas",
            "body": "odio fugit voluptatum ducimus earum autem est incidunt voluptatem\nodit reiciendis aliquam sunt sequi nulla dolorem\nnon facere repellendus voluptates quia\nratione harum vitae ut"
        },
        {
            "userId": 5,
            "id": 43,
            "title": "eligendi iste nostrum consequuntur adipisci praesentium sit beatae perferendis",
            "body": "similique fugit est\nillum et dolorum harum et voluptate eaque quidem\nexercitationem quos nam commodi possimus cum odio nihil nulla\ndolorum exercitationem magnam ex et a et distinctio debitis"
        },

        {
            "userId": 6,
            "id": 60,
            "title": "consequatur placeat omnis quisquam quia reprehenderit fugit veritatis facere",
            "body": "asperiores sunt ab assumenda cumque modi velit\nqui esse omnis\nvoluptate et fuga perferendis voluptas\nillo ratione amet aut et omnis"
        },
        {
            "userId": 7,
            "id": 61,
            "title": "voluptatem doloribus consectetur est ut ducimus",
            "body": "ab nemo optio odio\ndelectus tenetur corporis similique nobis repellendus rerum omnis facilis\nvero blanditiis debitis in nesciunt doloribus dicta dolores\nmagnam minus velit"
        },
        {
            "userId": 7,
            "id": 62,
            "title": "beatae enim quia vel",
            "body": "enim aspernatur illo distinctio quae praesentium\nbeatae alias amet delectus qui voluptate distinctio\nodit sint accusantium autem omnis\nquo molestiae omnis ea eveniet optio"
        },
        {
            "userId": 8,
            "id": 73,
            "title": "consequuntur deleniti eos quia temporibus ab aliquid at",
            "body": "voluptatem cumque tenetur consequatur expedita ipsum nemo quia explicabo\naut eum minima consequatur\ntempore cumque quae est et\net in consequuntur voluptatem voluptates aut"
        },
        {
            "userId": 9,
            "id": 81,
            "title": "tempora rem veritatis voluptas quo dolores vero",
            "body": "facere qui nesciunt est voluptatum voluptatem nisi\nsequi eligendi necessitatibus ea at rerum itaque\nharum non ratione velit laboriosam quis consequuntur\nex officiis minima doloremque voluptas ut aut"
        },
        {
            "userId": 9,
            "id": 90,
            "title": "ad iusto omnis odit dolor voluptatibus",
            "body": "minus omnis soluta quia\nqui sed adipisci voluptates illum ipsam voluptatem\neligendi officia ut in\neos soluta similique molestias praesentium blanditiis"
        },
        {
            "userId": 10,
            "id": 100,
            "title": "at nam consequatur ea labore ea harum",
            "body": "cupiditate quo est a modi nesciunt soluta\nipsa voluptas error itaque dicta in\nautem qui minus magnam et distinctio eum\naccusamus ratione error aut"
        }
    ]

    const userlist = [
        {
            "id": 1,
            "name": "Leanne Graham",
            "username": "Bret",
            "email": "Sincere@april.biz",
            "address": {
                "street": "Kulas Light",
                "suite": "Apt. 556",
                "city": "Gwenborough",
                "zipcode": "92998-3874",
                "geo": {
                    "lat": "-37.3159",
                    "lng": "81.1496"
                }
            },
            "phone": "1-770-736-8031 x56442",
            "website": "hildegard.org",
            "company": {
                "name": "Romaguera-Crona",
                "catchPhrase": "Multi-layered client-server neural-net",
                "bs": "harness real-time e-markets"
            }
        },
        {
            "id": 2,
            "name": "Ervin Howell",
            "username": "Antonette",
            "email": "Shanna@melissa.tv",
            "address": {
                "street": "Victor Plains",
                "suite": "Suite 879",
                "city": "Wisokyburgh",
                "zipcode": "90566-7771",
                "geo": {
                    "lat": "-43.9509",
                    "lng": "-34.4618"
                }
            },
            "phone": "010-692-6593 x09125",
            "website": "anastasia.net",
            "company": {
                "name": "Deckow-Crist",
                "catchPhrase": "Proactive didactic contingency",
                "bs": "synergize scalable supply-chains"
            }
        },
        {
            "id": 3,
            "name": "Clementine Bauch",
            "username": "Samantha",
            "email": "Nathan@yesenia.net",
            "address": {
                "street": "Douglas Extension",
                "suite": "Suite 847",
                "city": "McKenziehaven",
                "zipcode": "59590-4157",
                "geo": {
                    "lat": "-68.6102",
                    "lng": "-47.0653"
                }
            },
            "phone": "1-463-123-4447",
            "website": "ramiro.info",
            "company": {
                "name": "Romaguera-Jacobson",
                "catchPhrase": "Face to face bifurcated interface",
                "bs": "e-enable strategic applications"
            }
        },
        {
            "id": 4,
            "name": "Patricia Lebsack",
            "username": "Karianne",
            "email": "Julianne.OConner@kory.org",
            "address": {
                "street": "Hoeger Mall",
                "suite": "Apt. 692",
                "city": "South Elvis",
                "zipcode": "53919-4257",
                "geo": {
                    "lat": "29.4572",
                    "lng": "-164.2990"
                }
            },
            "phone": "493-170-9623 x156",
            "website": "kale.biz",
            "company": {
                "name": "Robel-Corkery",
                "catchPhrase": "Multi-tiered zero tolerance productivity",
                "bs": "transition cutting-edge web services"
            }
        },
        {
            "id": 5,
            "name": "Chelsey Dietrich",
            "username": "Kamren",
            "email": "Lucio_Hettinger@annie.ca",
            "address": {
                "street": "Skiles Walks",
                "suite": "Suite 351",
                "city": "Roscoeview",
                "zipcode": "33263",
                "geo": {
                    "lat": "-31.8129",
                    "lng": "62.5342"
                }
            },
            "phone": "(254)954-1289",
            "website": "demarco.info",
            "company": {
                "name": "Keebler LLC",
                "catchPhrase": "User-centric fault-tolerant solution",
                "bs": "revolutionize end-to-end systems"
            }
        },
        {
            "id": 6,
            "name": "Mrs. Dennis Schulist",
            "username": "Leopoldo_Corkery",
            "email": "Karley_Dach@jasper.info",
            "address": {
                "street": "Norberto Crossing",
                "suite": "Apt. 950",
                "city": "South Christy",
                "zipcode": "23505-1337",
                "geo": {
                    "lat": "-71.4197",
                    "lng": "71.7478"
                }
            },
            "phone": "1-477-935-8478 x6430",
            "website": "ola.org",
            "company": {
                "name": "Considine-Lockman",
                "catchPhrase": "Synchronised bottom-line interface",
                "bs": "e-enable innovative applications"
            }
        },
        {
            "id": 7,
            "name": "Kurtis Weissnat",
            "username": "Elwyn.Skiles",
            "email": "Telly.Hoeger@billy.biz",
            "address": {
                "street": "Rex Trail",
                "suite": "Suite 280",
                "city": "Howemouth",
                "zipcode": "58804-1099",
                "geo": {
                    "lat": "24.8918",
                    "lng": "21.8984"
                }
            },
            "phone": "210.067.6132",
            "website": "elvis.io",
            "company": {
                "name": "Johns Group",
                "catchPhrase": "Configurable multimedia task-force",
                "bs": "generate enterprise e-tailers"
            }
        },
        {
            "id": 8,
            "name": "Nicholas Runolfsdottir V",
            "username": "Maxime_Nienow",
            "email": "Sherwood@rosamond.me",
            "address": {
                "street": "Ellsworth Summit",
                "suite": "Suite 729",
                "city": "Aliyaview",
                "zipcode": "45169",
                "geo": {
                    "lat": "-14.3990",
                    "lng": "-120.7677"
                }
            },
            "phone": "586.493.6943 x140",
            "website": "jacynthe.com",
            "company": {
                "name": "Abernathy Group",
                "catchPhrase": "Implemented secondary concept",
                "bs": "e-enable extensible e-tailers"
            }
        },
        {
            "id": 9,
            "name": "Glenna Reichert",
            "username": "Delphine",
            "email": "Chaim_McDermott@dana.io",
            "address": {
                "street": "Dayna Park",
                "suite": "Suite 449",
                "city": "Bartholomebury",
                "zipcode": "76495-3109",
                "geo": {
                    "lat": "24.6463",
                    "lng": "-168.8889"
                }
            },
            "phone": "(775)976-6794 x41206",
            "website": "conrad.com",
            "company": {
                "name": "Yost and Sons",
                "catchPhrase": "Switchable contextually-based project",
                "bs": "aggregate real-time technologies"
            }
        },
        {
            "id": 10,
            "name": "Clementina DuBuque",
            "username": "Moriah.Stanton",
            "email": "Rey.Padberg@karina.biz",
            "address": {
                "street": "Kattie Turnpike",
                "suite": "Suite 198",
                "city": "Lebsackbury",
                "zipcode": "31428-2261",
                "geo": {
                    "lat": "-38.2386",
                    "lng": "57.2232"
                }
            },
            "phone": "024-648-3804",
            "website": "ambrose.net",
            "company": {
                "name": "Hoeger LLC",
                "catchPhrase": "Centralized empowering task-force",
                "bs": "target end-to-end models"
            }
        }
    ]
    beforeEach(() => {
        store = mockStore({
            logindata: { username: 'Bret', address: { street: 'Kulas Light' } },
        });
        store.dispatch = jest.fn();
        fetchMock.resetMocks();
        const user = { username: 'Bret', email: 'testUser@test.com', phone: '123-456-7890', address: { street: 'Kulas Light', zipcode: '12345' } };
        localStorage.setItem('user', JSON.stringify(user));
        fetchMock.mockResponseOnce(JSON.stringify(postData));
        fetchMock.mockResponseOnce(JSON.stringify(userlist))
    });

    afterEach(() => {
        localStorage.removeItem('user');
    });

    beforeAll(() => {
        global.fetch = fetchMock;
    });

    it('should intercept fetch request', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Main />
                </MemoryRouter>
            </Provider>
        );
        expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts');
    });

    it('should set FollowedTrendsList with correct data', async () => {
        const postData = [
            {
                "userId": 1,
                "id": 1,
                "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
            },
            {
                "userId": 1,
                "id": 2,
                "title": "qui est esse",
                "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
            },
            {
                "userId": 1,
                "id": 3,
                "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
                "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
            },
        ];

        fetchMock.mockResponses(
            [JSON.stringify(postData), { status: 200 }],
            [JSON.stringify([{
                "id": 1,
                "name": "Leanne Graham",
                "username": "Bret",
                "email": "Sincere@april.biz",
                "address": {
                    "street": "Kulas Light",
                    "suite": "Apt. 556",
                    "city": "Gwenborough",
                    "zipcode": "92998-3874",
                    "geo": {
                        "lat": "-37.3159",
                        "lng": "81.1496"
                    }
                },
                "phone": "1-770-736-8031 x56442",
                "website": "hildegard.org",
                "company": {
                    "name": "Romaguera-Crona",
                    "catchPhrase": "Multi-layered client-server neural-net",
                    "bs": "harness real-time e-markets"
                }
            },
            {
                "id": 2,
                "name": "Ervin Howell",
                "username": "Antonette",
                "email": "Shanna@melissa.tv",
                "address": {
                    "street": "Victor Plains",
                    "suite": "Suite 879",
                    "city": "Wisokyburgh",
                    "zipcode": "90566-7771",
                    "geo": {
                        "lat": "-43.9509",
                        "lng": "-34.4618"
                    }
                },
                "phone": "010-692-6593 x09125",
                "website": "anastasia.net",
                "company": {
                    "name": "Deckow-Crist",
                    "catchPhrase": "Proactive didactic contingency",
                    "bs": "synergize scalable supply-chains"
                }
            }]), { status: 200 }]
        );

        const { } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <Main />
                </MemoryRouter>
            </Provider>
        );
        const bretElements = screen.queryAllByText('Bret');
        expect(bretElements.length).toBeGreaterThan(0);
    });

    it('should filter FollowedTrendsList based on search text', async () => {
        const postData = [
            {
                "userId": 1,
                "id": 1,
                "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
            },
            {
                "userId": 1,
                "id": 2,
                "title": "qui est esse",
                "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
            },
            {
                "userId": 1,
                "id": 3,
                "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
                "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
            },
            
        ];

        fetchMock.mockResponses(
            [JSON.stringify(postData), { status: 200 }],
            [JSON.stringify([{
                "id": 1,
                "name": "Leanne Graham",
                "username": "Bret",
                "email": "Sincere@april.biz",
                "address": {
                    "street": "Kulas Light",
                    "suite": "Apt. 556",
                    "city": "Gwenborough",
                    "zipcode": "92998-3874",
                    "geo": {
                        "lat": "-37.3159",
                        "lng": "81.1496"
                    }
                },
                "phone": "1-770-736-8031 x56442",
                "website": "hildegard.org",
                "company": {
                    "name": "Romaguera-Crona",
                    "catchPhrase": "Multi-layered client-server neural-net",
                    "bs": "harness real-time e-markets"
                }
            },
            {
                "id": 2,
                "name": "Ervin Howell",
                "username": "Antonette",
                "email": "Shanna@melissa.tv",
                "address": {
                    "street": "Victor Plains",
                    "suite": "Suite 879",
                    "city": "Wisokyburgh",
                    "zipcode": "90566-7771",
                    "geo": {
                        "lat": "-43.9509",
                        "lng": "-34.4618"
                    }
                },
                "phone": "010-692-6593 x09125",
                "website": "anastasia.net",
                "company": {
                    "name": "Deckow-Crist",
                    "catchPhrase": "Proactive didactic contingency",
                    "bs": "synergize scalable supply-chains"
                }
            }]), { status: 200 }]
        );

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Main />
                </MemoryRouter>
            </Provider>
        );

        const searchText = 'xxxxxxxxx';
        const searchInput = screen.getByPlaceholderText('Search messages');
        fireEvent.change(searchInput, { target: { value: searchText } });
        const bretElements = screen.queryAllByText('Bret');
        expect(bretElements.length).toBe(1);
    });

    it('Add followed Trends Should more', async () => {
        const store = mockStore({
            userdata: userlist,
            jsondata: postData,
            logindata: { username: 'Bret', address: { street: 'Kulas Light' } },
        });
        const { getByPlaceholderText, getByText } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <Main />
                </MemoryRouter>
            </Provider>
        );
        fireEvent.change(getByPlaceholderText('Whom would you like to follow?'), { target: { value: 'Kamren' } })
        fireEvent.click(getByText('Add followers'))
        await waitFor(async () => {
            const elements = await screen.findAllByText(/Kamren/i);
            const count = elements.length;
            expect(count).toBeGreaterThanOrEqual(2);
        });
    })

    it('delete followed Trends Should less', async () => {
        const store = mockStore({
            userdata: userlist,
            jsondata: postData,
            logindata: {
                "id": 1,
                "name": "Leanne Graham",
                "username": "Bret",
                "email": "Sincere@april.biz",
                "address": {
                    "street": "Kulas Light",
                    "suite": "Apt. 556",
                    "city": "Gwenborough",
                    "zipcode": "92998-3874",
                    "geo": {
                        "lat": "-37.3159",
                        "lng": "81.1496"
                    }
                },
                "phone": "1-770-736-8031 x56442",
                "website": "hildegard.org",
                "company": {
                    "name": "Romaguera-Crona",
                    "catchPhrase": "Multi-layered client-server neural-net",
                    "bs": "harness real-time e-markets"
                }
            },
        });
        const { getByPlaceholderText, getByText } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <Main />
                </MemoryRouter>
            </Provider>
        );
        await waitFor(async () => {
            const elements = await screen.findAllByText(/Antonette/i);
            const count = elements.length;
            expect(count).toBeGreaterThanOrEqual(1);
        });

        await waitFor(async () => {
            const userElement = screen.getByText('Antonette');
            const unfollowButton = userElement.parentElement.parentElement.querySelector('button');
            expect(unfollowButton).toBeInTheDocument();
            fireEvent.click(unfollowButton);
            waitFor(async () => {
                const userElement = screen.queryByText('Antonette');
                expect(userElement).toBeNull();
            })
        })
    })

    it('update state', async () => {
        const store = mockStore({
            userdata: userlist,
            jsondata: postData,
            logindata: {
                "id": 1,
                "name": "Leanne Graham",
                "username": "Bret",
                "email": "Sincere@april.biz",
                "address": {
                    "street": "Kulas Light",
                    "suite": "Apt. 556",
                    "city": "Gwenborough",
                    "zipcode": "92998-3874",
                    "geo": {
                        "lat": "-37.3159",
                        "lng": "81.1496"
                    }
                },
                "phone": "1-770-736-8031 x56442",
                "website": "hildegard.org",
                "company": {
                    "name": "Romaguera-Crona",
                    "catchPhrase": "jeststate",
                    "bs": "harness real-time e-markets"
                }
            },
        });
        const { getByPlaceholderText, getByText } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <Main />
                </MemoryRouter>
            </Provider>
        );
        fireEvent.change(getByPlaceholderText("What's your State?"), { target: { value: 'jeststate' } });
        fireEvent.click(getByText('Update State'));
        expect(screen.getByDisplayValue('jeststate')).toBeInTheDocument();
        expect(screen.getByText(/State:.*jeststate/)).toBeInTheDocument();
    })

    it('update Trends', async () => {
        const store = mockStore({
            userdata: userlist,
            jsondata: postData,
            logindata: {
                "id": 1,
                "name": "Leanne Graham",
                "username": "Bret",
                "email": "Sincere@april.biz",
                "address": {
                    "street": "Kulas Light",
                    "suite": "Apt. 556",
                    "city": "Gwenborough",
                    "zipcode": "92998-3874",
                    "geo": {
                        "lat": "-37.3159",
                        "lng": "81.1496"
                    }
                },
                "phone": "1-770-736-8031 x56442",
                "website": "hildegard.org",
                "company": {
                    "name": "Romaguera-Crona",
                    "catchPhrase": "jeststate",
                    "bs": "harness real-time e-markets"
                }
            },
        });
        const { getByPlaceholderText, getByText ,queryAllByText} = render(
            <Provider store={store}>
                <MemoryRouter>
                    <Main />
                </MemoryRouter>
            </Provider>
        );
        fireEvent.change(getByPlaceholderText("What's title?"), { target: { value: 'jestposttitle' } });
        fireEvent.change(getByPlaceholderText("What's body?"), { target: { value: 'jestpostbody' } });
        const postButton = screen.getByTestId('post-button');
        fireEvent.click(postButton);
        const bodyElements = queryAllByText('jestpostbody');
        expect(bodyElements.length).toBe(2);
    })
});
