from .base import SplashBaseItem,SplashImageEmptyFaceItem

splash_items = [
    SplashBaseItem(
        key='coco-hector-miguel',
        filename='coco-hector-miguel.jpg',
        faceless_filename='coco-hector-miguel-faceless.png',
        label='Coco - Hector and Miguel',
        category_key='disney',
        num_faces=2,
        empty_faces=[
            SplashImageEmptyFaceItem(
                    left=430,
                    top=103,
                    angle=40,
                    width=96,
                    height=120,
                    label='Hector'
            ),
             SplashImageEmptyFaceItem(
                    left=620,
                    top=209,
                    angle=345,
                    width=113,
                    height=96,
                    label='Miguel'
            ),
        ]
    ),
    SplashBaseItem(
        key='lol-rakan-xayah',
        filename='rakan-xayah.jpg',
        faceless_filename='rakan-xayah-faceless.png',
        label='Rakan and Xayah',
        category_key='league_of_legends',
        num_faces=2,
        empty_faces=[
            SplashImageEmptyFaceItem(
                    left=340,
                    top=203,
                    angle=20,
                    width=70,
                    height=80,
                    label='Rakan'
            ),
             SplashImageEmptyFaceItem(
                    left=386,
                    top=289,
                    angle=345,
                    width=62,
                    height=62,
                    label='Xayah'
            ),
        ]
    ),
    SplashBaseItem(
        key='mickey-minnie-dancing',
        filename='mickey-minnie-dancing.png',
        faceless_filename='mickey-minnie-dancing-faceless.png',
        label='Mickey and Minney Dancing',
        category_key='disney',
        num_faces=2,
        empty_faces=[
            SplashImageEmptyFaceItem(
                    left=95,
                    top=78,
                    angle=350,
                    width=185,
                    height=173,
                    label='Mickey'
            ),
             SplashImageEmptyFaceItem(
                    left=255,
                    top=100,
                    angle=325,
                    width=160,
                    height=173,
                    label='Minnie'
            ),
        ]
    ),
]

def get_splash():
    return splash_items
