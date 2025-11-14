interface ContacsInfo {
  whatsapp: string
  instagram: string
  location: string[]
}

interface BussinesInfo {
  name: string
  description: string
  logoPath: string
  contacsInfo: ContacsInfo
}

export const businesInfo = {
  name: 'JAMU234',
  description: 'JAMU TRADISIONAL DENGAN REMPAH ASLI DAN TANPA PEMANIS BUATAN',
  logoPath: '/234.png',
  contacsInfo: {
    whatsapp: '6283113367276', //+62 831-1336-7276 '0882006186099',
    instagram: '@jagadrenata', //awali dengan @
    location: [123, 123], //long, lat
  },
}
