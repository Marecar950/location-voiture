<?php

namespace App\Controller;

use App\Entity\Voiture;
use App\Entity\Location;
use App\Repository\VoitureRepository;
use DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Filesystem\Filesystem;

class VoitureController extends AbstractController
{

    #[Route('/voiture', name: 'app_voiture', methods: ['POST', 'GET'])]
    public function index(): Response
    {

        return $this->render('voiture/index.html.twig', [
            'controller_name' => 'VoitureController',
        ]);
    }

    #[Route('/voitures', name: 'app_voiture_index', methods: ['GET'])]
    public function getVoitures(VoitureRepository $voitureRepository): Response
    {
        $voitures = $voitureRepository->findAllWithLocation();

        if (empty($voitures)) {
            return $this->json(['message' => 'Aucune voiture trouvée']);
        }

        foreach ($voitures as &$voiture) {
            if ($voiture['departureDate']) {
                $voiture['departureDate'] = $voiture['departureDate']->format('d/m/Y');
            }
            if ($voiture['returnDate']) {
                $voiture['returnDate'] = $voiture['returnDate']->format('d/m/Y');
            }
        }

        return $this->json($voitures);
    }

    #[Route('/voiture/search', name: 'voiture_search_by_marque', methods: ['GET'])]
    public function findVoitureByMarque(VoitureRepository $voitureRepository, Request $request): Response
    {
        $marque = $request->query->get('marque');
        $voitures = $voitureRepository->findVoitureWithLocationByMarque($marque);

        if(!$voitures) {
            return $this->json(['error' => 'Aucune voiture trouvée pour la marque']);
        }

        foreach ($voitures as &$voiture) {
            $voiture['departureDate'] = $voiture['departureDate']->format('d/m/Y');
            $voiture['returnDate'] = $voiture['returnDate']->format('d/m/Y');
        }

        return $this->json($voitures);
    }

    #[Route('/voiture/ajouter', name: 'app_voiture_ajouter', methods: ['POST'])]
    public function ajouterVoiture(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): JsonResponse 
    {
        
        $immatriculation = $request->request->get('immatriculation');

        $existingVoiture = $entityManager->getRepository(Voiture::class)->findOneBy(['immatriculation' => $immatriculation]);

        if ($existingVoiture) {
            return new JsonResponse(['error' => 'Une voiture avec cette immatriculation existe déjà']);
        } else {

        $marque = $request->request->get('marque');
        $carburant = $request->request->get('carburant');
        $kilometrage = $request->request->get('kilometrage');
        $passagers = $request->request->get('passagers');
        $transmission = $request->request->get('transmission');
        $prixlocation = $request->request->get('prixLocation');
        $disponibilite = $request->request->get('disponibilite');
        $climatisationString = $request->request->get('climatisation');
        $siegesEnfantsString = $request->request->get('siegesEnfants');
        $climatisation = $climatisationString === "true" ? true : false;
        $siegesEnfants = $siegesEnfantsString === "true" ? true : false;
        $description = $request->request->get('description');

        $voiture = new Voiture();
        $voiture->setImmatriculation($immatriculation);
        $voiture->setMarque($marque);
        $voiture->setTypeCarburant($carburant);
        $voiture->setKilometrage($kilometrage);
        $voiture->setNombrePassagers($passagers);
        $voiture->setTransmission($transmission);
        $voiture->setPrixLocation($prixlocation);
        $voiture->setDisponibilite($disponibilite);
        $voiture->setClimatisation($climatisation);
        $voiture->setSiegesEnfants($siegesEnfants);

        $uploadedFile = $request->files->get('image');    
        if ($uploadedFile) {
            $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename.'-'.uniqid().'.'.$uploadedFile->guessExtension();
            $uploadedFile->move($this->getParameter('uploads_directory'), $newFilename);
            $voiture->setImage($newFilename);
        }

        $fileAndroid = $request->request->get('image'); 
        if (preg_match('/^data:image\/(\w+);base64,/', $fileAndroid, $matches)) {
            $type = $matches[1];

            $fileAndroid = substr($fileAndroid, strpos($fileAndroid, ',') + 1);
            $fileAndroid = base64_decode($fileAndroid);
            $originalFilename = 'uploaded_image';
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename.'-'.uniqid().'.'.$type;
            $filesystem = new Filesystem();
            $uploadsDirectory = $this->getParameter('uploads_directory');
            $filePath = $uploadsDirectory . '/' . $newFilename;
            $filesystem->dumpFile($filePath, $fileAndroid);
            $voiture->setImage($newFilename);
        }   

        $voiture->setDescription($description);

        $departureLocation = $request->request->get('lieuDepart');
        $dateDebut = $request->request->get('dateDebut');
        $departureDate = DateTimeImmutable::createFromFormat('Y-m-d', $dateDebut);
        $dateFin = $request->request->get('dateFin');
        $returnDate = DateTimeImmutable::createFromFormat('Y-m-d', $dateFin);

        if ($disponibilite === 'disponible') {

            $location = new Location();
            $location->setDepartureLocation($departureLocation);
            $location->setDepartureDate($departureDate);
            $location->setReturnDate($returnDate);
            $location->setVoiture($voiture);
            $entityManager->persist($location);
        }
        
        $entityManager->persist($voiture);
        $entityManager->flush();
        
        return new JsonResponse(['message' => 'La voiture a été ajoutée avec succès']);
        }       
    }

    #[Route('/voiture/{id}', name: 'app_voiture_show', methods: ['GET'])]
    public function show(VoitureRepository $voitureRepository, int $id): Response
    {
        $voiture = $voitureRepository->findVoitureWithLocation($id);

        if (!$voiture) {
            throw $this->createNotFoundException(
                'La voiture avec l\'ID ' . $id . ' n\'existe pas.'
            );
        }

        foreach ($voiture as &$result) {
            if ($result['departureDate']) {
                $result['departureDate'] = $result['departureDate']->format('d/m/Y');
            } 
            if ($result['returnDate']) {
                $result['returnDate'] = $result['returnDate']->format('d/m/Y');
            }
        }    

        return $this->json($voiture);
    }

    #[Route('/search_voitures', name: 'search_voiture_by_location', methods: ['GET'])]
    public function searchVoitureByLocation(Request $request, VoitureRepository $voitureRepository): Response
    {
        $departureLocation = $request->query->get('departureLocation');
        $voitures = $voitureRepository->findVoituresByDepartureLocation($departureLocation);

        foreach ($voitures as &$voiture) {
            if ($voiture['departureDate']) {
                $voiture['departureDate'] = $voiture['departureDate']->format('d/m/Y');
            }
            if ($voiture['returnDate']) {
                $voiture['returnDate'] = $voiture['returnDate']->format('d/m/Y');
            }
        }    
        
        return $this->json($voitures);
    }

    #[Route('/voiture/edit/{id}', name: 'app_voiture_edit', methods: ['POST'])]
    public function editVoiture(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger, int $id): Response
    {
        $voiture = $entityManager->getRepository(Voiture::class)->find($id);

        if ($voiture) {
        
        $immatriculation = $request->request->get('immatriculation');
        $marque = $request->request->get('marque');
        $carburant = $request->request->get('typeCarburant');
        $kilometrage = $request->request->get('kilometrage');
        $passagers = $request->request->get('nombrePassagers');
        $transmission = $request->request->get('transmission');
        $prixlocation = $request->request->get('prixLocation');
        $disponibilite = $request->request->get('disponibilite');
        $climatisationString = $request->request->get('climatisation');
        $siegesEnfantsString = $request->request->get('siegesEnfants');
        $climatisation = $climatisationString === "true" ? true : false;
        $siegesEnfants = $siegesEnfantsString === "true" ? true : false; 

        $uploadedFile = $request->files->get('newImage');
        $description = $request->request->get('description');

        $voiture->setImmatriculation($immatriculation);
        $voiture->setMarque($marque);
        $voiture->setTypeCarburant($carburant);
        $voiture->setKilometrage($kilometrage);
        $voiture->setNombrePassagers($passagers);
        $voiture->setTransmission($transmission);
        $voiture->setPrixLocation($prixlocation);
        $voiture->setDisponibilite($disponibilite);
        $voiture->setClimatisation($climatisation);
        $voiture->setSiegesEnfants($siegesEnfants);

        if ($uploadedFile) {
            $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename.'-'.uniqid().'.'.$uploadedFile->guessExtension();
            $uploadedFile->move($this->getParameter('uploads_directory'), $newFilename);

            $voiture->setImage($newFilename);
        } 
        
        $file = $request->request->get('image');
        if ($file) {
            if (preg_match('/^data:image\/(\w+);base64,/', $file, $matches)) {
                $type = $matches[1]; 

                $file = substr($file, strpos($file, ',') +1);
                $file = base64_decode($file);
                $originalFilename = 'uploaded_image';
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename.'-'.uniqid().'.'.$type;
                $filesystem = new Filesystem();
                $uploadsDirectory = $this->getParameter('uploads_directory');
                $filePath = $uploadsDirectory . '/' .$newFilename;
                $filesystem->dumpFile($filePath, $file);

                $voiture->setImage($newFilename);
            }
        }

        $voiture->setDescription($description);

        $departureLocation = $request->request->get('lieuDepart');
        $dateDebut = $request->request->get('dateDebut');
        $departureDate = DateTimeImmutable::createFromFormat('Y-m-d', $dateDebut);
        $dateFin = $request->request->get('dateFin');
        $returnDate = DateTimeImmutable::createFromFormat('Y-m-d', $dateFin);

        if ($disponibilite === 'disponible') {

            $location = $voiture->getLocations()->first();
            $location->setDepartureLocation($departureLocation);
            $location->setDepartureDate($departureDate);
            $location->setReturnDate($returnDate);
        }

        $entityManager->persist($voiture);
        $entityManager->flush();
      } 

        return $this->json(['message' => 'La voiture a été modifiée avec succès']);
        
    }

    #[Route('/voiture/delete/{id}', name: 'app_voiture_delete', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $entityManager, int $id)
    {
        $voiture = $entityManager->getRepository(Voiture::class)->find($id);

        if(!$voiture) {
        }

        $locations = $voiture->getLocations();

        foreach ($locations as $location) {
            $entityManager->remove($location);
        }    

        $entityManager->remove($voiture);
        $entityManager->flush();

        return $this->json(['message' => 'La voiture a été supprimée avec succès']);
    }
}

