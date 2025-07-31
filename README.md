# Ozone

## Dev Setup

```bash
cd Project1
docker compose up -d

cd ClientApp
npm install
npm run start
```

Go to http://localhost:44436/

## Initial Data

```bash
docker compose exec mongo mongosh -u ozone -p ozone
```

```js
use ozone

db.options.insertOne(
  {
    _id: ObjectId('6522fceed03ad0f8c5edc96f'),
    boardingStatuses: [
      { name: 'Цілий', color: '#5969ff' },
      { name: 'Пошкоджений', color: '#ff407b' },
      { name: 'Втрата', color: '#ef172c' }
    ],
    dronAppointment: [
      {
        color: '#e4ed3e',
        name: 'Фотоліт',
        legacyId: 'b25788b2-cd6e-4c34-ab6e-0c3b1093452e'
      },
      {
        color: '#eb3b1b',
        name: 'Ударний мультироторний',
        legacyId: 'd0b07239-73d9-42c9-88a4-86a55c58dc86'
      },
      {
        color: '#7e108f',
        name: 'Ударне крило',
        legacyId: '4b3a115b-32ce-44d5-8ddd-9d03eab539e1'
      },
      {
        color: '#41ff5a',
        name: 'Крило',
        legacyId: '0418539a-9429-4799-9e9f-29bd52177d9e'
      },
      {
        color: '#1b47fd',
        name: 'Розвідувальний мультироторний',
        legacyId: 'e8f08161-829a-48b0-97a6-10fb011b143b'
      },
      {
        color: '#92aab9',
        name: 'FPV',
        legacyId: '08aa2629-ed71-426b-9d9e-e6be0a8a15e9'
      }
    ],
    dronModels: [
      {
        color: '',
        name: 'Лелека - 100',
        legacyId: '57e97965-c667-4918-9d5a-867bd5f37b45'
      },
      {
        color: '',
        name: 'Фурія',
        legacyId: '0054aae0-d88c-40d3-9362-c19c977a4e84'
      },
      {
        color: '',
        name: 'Валькірія',
        legacyId: '8412d1fe-56e1-4669-98f8-b5f46bd4b6d9'
      },
      {
        color: '',
        name: 'Шарк',
        legacyId: '7a25e2aa-345b-49d3-b63a-821107a62e26'
      },
      {
        color: '',
        name: 'Шарк міні',
        legacyId: '67713145-2143-4795-afcd-ff46a55e2b9d'
      },
      {
        color: '',
        name: 'Пума',
        legacyId: '4f3bc74b-c2e2-444a-8cf1-54f1f23c1287'
      },
      {
        color: '',
        name: 'Poseidon',
        legacyId: '919563f6-0b5d-4695-8571-fa25e041dfe6'
      },
      {
        color: '',
        name: 'Heidrun RQ-35',
        legacyId: '111fe3e4-14f6-46e8-b84b-7dc64e68450a'
      },
      {
        color: '',
        name: 'ACS-3',
        legacyId: 'e9f3d62e-abea-4213-9369-60b21b62c920'
      },
      {
        color: '',
        name: 'ScanEagle',
        legacyId: 'c7692ef9-5361-4785-be6c-a02756839686'
      },
      {
        color: '',
        name: 'Vector',
        legacyId: 'a1f44592-8969-4e09-9264-ac81689592a3'
      },
      {
        color: '',
        name: 'PD -1',
        legacyId: '344b1126-3401-4469-bca6-1aa8ccab9167'
      },
      {
        color: '',
        name: 'PD - 2',
        legacyId: '774789fa-0158-4802-aac2-84c7c24ef50b'
      },
      {
        color: '',
        name: 'RQ-20 Puma',
        legacyId: '5bfc8d08-5cf8-4008-9a59-39aad0d5fc65'
      },
      {
        color: '',
        name: 'Penguine',
        legacyId: '9af841b9-d510-4c65-a65b-51cb9c44164b'
      },
      {
        color: '',
        name: 'Мара - 2П',
        legacyId: '567c7ef6-fce3-4fbb-9b42-616e8e77a0b7'
      },
      {
        color: '',
        name: 'Cetus',
        legacyId: '80d3239d-ab39-44ca-b28a-c9ef99c73d09'
      },
      {
        color: '',
        name: 'R18',
        legacyId: '14e04334-c12c-4089-a08e-ec3273005226'
      },
      {
        color: '',
        name: 'Punisher',
        legacyId: '101d1fc6-aa41-40b5-b641-1b671bd64f49'
      },
      {
        color: '',
        name: 'Warmate',
        legacyId: 'b04cedf1-9220-4f67-bb4c-b2131e71b36c'
      },
      {
        color: '',
        name: 'RAM - 2',
        legacyId: 'bea41ee1-fe60-4867-8b60-7d08acc4ec3d'
      },
      {
        color: '',
        name: 'Switchblade 300',
        legacyId: '9fc7437f-50fe-468e-92be-b01bcb6541aa'
      },
      {
        color: '',
        name: 'Switchblade 600',
        legacyId: '2bc0094d-1ad8-4588-85d2-64b328748c78'
      },
      {
        color: '',
        name: 'Vampire',
        legacyId: '503ccfc8-b183-4411-8946-2ff953b43e2b'
      },
      {
        color: '',
        name: 'Nemesis',
        legacyId: '18565055-e4cb-46d7-b0f2-6947b79b3087'
      },
      {
        color: '',
        name: 'Кажан Е620',
        legacyId: '865e8ab6-615c-4f26-ab57-76d93aaf311b'
      },
      {
        color: '',
        name: 'Кажан Е630',
        legacyId: '90d12c39-dd5d-43b0-8958-d309feca921b'
      },
      {
        color: '',
        name: 'Лелека - LR',
        legacyId: 'ece98f8a-c6ce-4db2-8a1d-f1145a53f4e9'
      },
      {
        color: '',
        name: 'Mavic 3E',
        legacyId: '013120d0-c373-434c-9b17-d33d78d96f23'
      },
      {
        color: '',
        name: 'Mavic 3',
        legacyId: '2c859cef-e181-4bc2-9a4c-26adf3fc7a88'
      },
      {
        color: '',
        name: 'Mavic 3pro',
        legacyId: 'bec46978-c257-4c33-b592-85ba96a14cde'
      },
      {
        color: '',
        name: 'Mavic 3T',
        legacyId: '8ee32ad9-1198-4b36-8020-ac009d484993'
      },
      {
        color: '',
        name: 'Mavic 3classic',
        legacyId: '2182e9c0-7365-46e7-a5b9-a8804e00ee75'
      },
      {
        color: '',
        name: 'Matrice 30',
        legacyId: '167dbe72-f9aa-40b9-b96f-92f3eb2d16da'
      },
      {
        color: '',
        name: 'Matrice 30T',
        legacyId: '03e99cdc-371b-46f8-a678-17d5b321e2a3'
      },
      {
        color: '',
        name: 'Matrice 300 RTK',
        legacyId: '352075ea-cce0-46fc-83fd-93c01b0dd431'
      },
      {
        color: '',
        name: 'Autel 4T',
        legacyId: '72f19e3b-08f3-4959-a248-b8887c75da7a'
      },
      {
        color: '',
        name: 'Довбуш Т-20',
        legacyId: 'deec7098-132d-4561-8191-5c7acf9db392'
      },
      {
        color: '',
        name: 'Mavic 2',
        legacyId: '86a39132-00ac-4bcd-8729-2db66c49b612'
      },
      {
        color: '',
        name: 'Flyeye_3.0',
        legacyId: '6963676e-0464-4ea2-95b6-12d4bbde3429'
      },
      {
        color: '',
        name: 'Чаклун',
        legacyId: '95e92cf2-94f0-4850-9176-80270ba7b356'
      },
      {
        color: '',
        name: 'Магура',
        legacyId: '5665c0cc-3493-48f8-b0c9-7c2075d7390e'
      },
      {
        color: '',
        name: 'FPV літакового типу',
        legacyId: '1c73dcb1-16ee-4337-9e90-bc0f80b3acc0'
      },
      {
        color: '',
        name: 'SIRKO',
        legacyId: '5521fb1d-1944-4446-80f1-cdd0b637ccc9'
      },
      {
        color: '',
        name: 'Домаха',
        legacyId: 'e927615a-f1b1-41f9-b8b0-55b25979a2f3'
      },
      {
        color: '',
        name: 'Мара',
        legacyId: '70d2ac55-e99c-4c74-97a5-acf580ba26e2'
      },
      {
        color: '',
        name: 'Scan Eagle',
        legacyId: '2b560ed1-6b9f-4547-859b-d083ee978b2a'
      },
      {
        color: '',
        name: 'Sparrow',
        legacyId: 'e572f5db-1b12-4928-9a1d-75bc3fa42080'
      },
      {
        color: '',
        name: 'Hawk',
        legacyId: '3f7a0443-c708-473f-82e8-d075ca79109d'
      },
      {
        color: '',
        name: 'UA-Бета',
        legacyId: '7a596cb9-1236-4007-b65c-3211bced754b'
      },
      {
        color: '',
        name: 'AR-3',
        legacyId: '78cc5230-11d8-4319-ab2c-a625ca1249c7'
      },
      {
        color: '',
        name: 'FPV',
        legacyId: '6d808068-01e7-42f8-a54e-9659dae5ef1b'
      },
      {
        color: '',
        name: 'PEGAS',
        legacyId: '4cb61836-2078-4a86-9bf8-63b922286f8c'
      },
      {
        color: '',
        name: 'СКІФ',
        legacyId: 'd43e8d51-df79-443b-a742-0c20a74a042c'
      },
      {
        color: '',
        name: 'Flirt Cetus',
        legacyId: '4127ecc5-cd3a-44e7-a90c-36bb02755d1b'
      },
      {
        color: '',
        name: 'Avenger',
        legacyId: '85eee83e-5bea-4c7b-8926-f3c91a45ebd7'
      },
      {
        color: '',
        name: 'Mavic 3 Fly More Combo',
        legacyId: '20b08b93-aaaf-48c2-ad04-d1916c8bb4bf'
      },
      {
        color: '',
        name: 'Skydio X10D',
        legacyId: 'd73bae24-c942-46f4-8f68-10f209628070'
      },
      {
        color: '',
        name: 'DJI Air 3',
        legacyId: 'c7ed7b0b-5881-4916-a8e0-a3a469cdf084'
      },
      {
        color: '',
        name: 'Autel Evo 2',
        legacyId: '797538a2-c1f0-420e-b714-774d476410d2'
      },
      {
        color: '',
        name: 'TRINITY F90+',
        legacyId: '35b922c8-2265-4e47-bac2-3537771c0426'
      },
      {
        color: '',
        name: 'ПЕРУН',
        legacyId: '15d2d7a7-e6b4-4c19-badd-ea3f4793b981'
      },
      {
        color: '',
        name: 'Windhover',
        legacyId: 'd571e4e0-adb2-4261-b509-74943549676a'
      }
    ],
    flightStatus: [
      {
        color: '#275fc8',
        name: '     З а я в к а      ',
        legacyId: '0'
      },
      {
        color: '#5969ff',
        name: '     П  о  л  і  т     ',
        legacyId: '1'
      },
      { color: '#5969ff', name: '     ЛБЗ Вперед     ', legacyId: '2' },
      { color: '#5969ff', name: '     Повернення     ', legacyId: '3' },
      { color: '#5969ff', name: '     ЛБЗ Назад     ', legacyId: '4' },
      {
        color: '#5969ff',
        name: '     Початок зниження     ',
        legacyId: '5'
      },
      { color: '#399f0c', name: '     Завершено     ', legacyId: '6' }
    ],
    discordUrl: 'https://discord.com1/',
    guests: [
      {
        isEnabled: false,
        name: 'Гість1',
        roleId: 8,
        legacyId: 'b34fbb87-e1b2-46f9-884d-b5e93f5a9b75'
      },
      {
        isEnabled: false,
        name: 'Гість2',
        roleId: 9,
        legacyId: '1af3b3eb-352e-4eaa-b938-580837f2707f'
      },
      {
        isEnabled: false,
        name: 'Гість 3',
        roleId: 10,
        legacyId: '9864052b-9913-4e78-b3ae-c35e4bcf2855'
      },
      {
        isEnabled: false,
        name: 'Гість 4',
        roleId: 11,
        legacyId: '3e1af584-8e18-4684-b581-92a00daed1b0'
      }
    ]
  }
)
  
db.users.insertOne({'login': 'brovko93', 'password': 'Admin@123', 'role': 1})
```