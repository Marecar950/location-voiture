<?php

namespace App\Repository;

use App\Entity\Voiture;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Voiture>
 *
 * @method Voiture|null find($id, $lockMode = null, $lockVersion = null)
 * @method Voiture|null findOneBy(array $criteria, array $orderBy = null)
 * @method Voiture[]    findAll()
 * @method Voiture[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VoitureRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Voiture::class);
    }

//    /**
//     * @return Voiture[] Returns an array of Voiture objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('v')
//            ->andWhere('v.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('v.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Voiture
//    {
//        return $this->createQueryBuilder('v')
//            ->andWhere('v.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }

      public function findAllWithLocation()
      {
        return $this->createQueryBuilder('v')
            ->leftJoin('v.locations', 'l')
            ->addSelect('l.departureLocation', 'l.departureDate', 'l.returnDate')
            ->getQuery()
            ->getResult();
      }

      public function findVoitureWithLocation(int $id)
      {
        return $this->createQueryBuilder('v')
            ->select('v', 'l.departureLocation', 'l.departureDate', 'l.returnDate')
            ->leftJoin('v.locations', 'l')
            ->where('v.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
      }

      public function findVoituresDisponibles($departureLocation, $departureDate, $returnDate)
      {
        return $this->createQueryBuilder('v')
                    ->select('v', 'l.departureLocation', 'l.departureDate', 'l.returnDate', '(DATE_DIFF(:returnDate, :departureDate) +1) AS nb_days', '(DATE_DIFF(:returnDate, :departureDate) +1) * v.prixLocation AS prix_location')
                    ->leftJoin('v.locations', 'l')
                    ->where('l.departureLocation = :departureLocation')
                    ->andWhere('l.departureDate <= :departureDate')
                    ->andWhere('l.returnDate >= :returnDate')
                    ->setParameter('departureLocation', $departureLocation)
                    ->setParameter('departureDate', $departureDate)
                    ->setParameter('returnDate', $returnDate)
                    ->getQuery()
                    ->getResult();
      }

      public function findVoitureWithLocationByMarque(string $marque)
      {
        return $this->createQueryBuilder('v')
            ->select('v', 'l.departureLocation', 'l.departureDate', 'l.returnDate')
            ->leftJoin('v.locations', 'l')
            ->where('v.marque LIKE :marque')
            ->setParameter('marque', '%'.$marque.'%')
            ->getQuery()
            ->getResult();
      }

      public function findVoituresByDepartureLocation(string $departureLocation)
      {
        return $this->createQueryBuilder('v')
            ->select('v', 'l.departureLocation', 'l.departureDate', 'l.returnDate')
            ->leftJoin('v.locations', 'l')
            ->where('l.departureLocation = :departureLocation')
            ->setParameter('departureLocation', $departureLocation)
            ->getQuery()
            ->getResult();
      }
}
