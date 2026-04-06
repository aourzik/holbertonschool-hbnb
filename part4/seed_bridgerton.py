from app import create_app, db
from app.models.user import User
from app.models.place import Place
from app.models.amenity import Amenity

app = create_app()

def seed_data():
    with app.app_context():
        # 1. On nettoie la base pour éviter les doublons
        print("Cleaning database...")
        db.drop_all()
        db.create_all()

        # 2. Création des Équipements (Amenities)
        print("Creating Amenities...")
        ballroom = Amenity(name="Grand Ballroom")
        stables = Amenity(name="Royal Stables")
        library = Amenity(name="Private Library")
        garden = Amenity(name="English Garden")
        db.session.add_all([ballroom, stables, library, garden])
        db.session.commit()

        # 3. Création de l'ADMIN (Lady Whistledown herself)
        print("Creating Admin...")
        admin = User(
            first_name="Lady",
            last_name="Whistledown",
            email="admin@ton.com",
            password="royalpassword",
            is_admin=True
        )
        db.session.add(admin)
        db.session.commit()

        # 4. Création d'un Utilisateur Standard (Le Duc)
        print("Creating User...")
        duc = User(
            first_name="Simon",
            last_name="Basset",
            email="simon@duc.com",
            password="password123",
            is_admin=False
        )
        db.session.add(duc)
        db.session.commit()

        # 5. Création des Logements (Places)
        print("Creating Estates...")
        
        # Manoir 1 : Clyvedon Castle
        clyvedon = Place(
            title="Clyvedon Castle",
            description="The historic seat of the Duke of Hastings. Perfect for a honeymoon far from the gossip of the Ton.",
            price=8500.0,
            latitude=51.5033,
            longitude=-0.1197,
            owner_id=duc.id
        )
        clyvedon.amenities.append(ballroom)
        clyvedon.amenities.append(stables)

        # Manoir 2 : Bridgerton House
        bridgerton_house = Place(
            title="Bridgerton House",
            description="A magnificent residence in Mayfair, known for its wisteria and the most elegant tea parties.",
            price=4200.0,
            latitude=51.5123,
            longitude=-0.1458,
            owner_id=admin.id # Lady Whistledown manage celle-là
        )
        bridgerton_house.amenities.append(garden)
        bridgerton_house.amenities.append(library)

        # Manoir 3 : Featherington Estate
        featherington = Place(
            title="Featherington Estate",
            description="Bright, bold and impossible to miss. A house as vibrant as its inhabitants.",
            price=3100.0,
            latitude=51.5095,
            longitude=-0.1321,
            owner_id=admin.id
        )

        db.session.add_all([clyvedon, bridgerton_house, featherington])
        db.session.commit()

        print("--- SEEDING COMPLETE ---")
        print("Admin: admin@ton.com / royalpassword")
        print("User: simon@duc.com / password123")

if __name__ == "__main__":
    seed_data()