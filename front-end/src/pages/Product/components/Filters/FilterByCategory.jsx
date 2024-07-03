import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import categoryApi from '../../../../api/categoryApi'
import { Box, Button, makeStyles, Typography } from '@material-ui/core'
import { Menu } from 'antd'


const useStyles = makeStyles(theme => ({
  root: {
      // padding: theme.spacing(2)
  },

  menu: {
      padding: 0,
      margin: 0,
      listStyleType:'none',
      '& > li' : {
          marginTop: theme.spacing(1),
          transitions: 'all .25s',
          '&:hover':{
              color: theme.palette.primary.main,
              cursor: 'pointer',
              fontWeight:'bold',
          }
      }
  },
}))

function FilterByCategory({onChange}) {
  const [categoryList,setCategoryList] = useState([]) 

  const classes = useStyles()


  useEffect(() => {
    (async () =>{
        try {    
            const list = await categoryApi.getAll()
            setCategoryList(list.map(x => ({
                id: x._id,
                gender : x.gender,
            })))
        } catch (error) {
            console.log('Failed to fetch category list', error);
        }
    })()
},[])

// console.log("categoryList",categoryList);

const handleCategoryClick = (category) => {
  if (onChange) {
      onChange(category.gender)
    }
    console.log('Click cate :' ,category.gender);
}

  
  

  return (
    <Box className={classes.root}>
        <ul className={classes.menu}>
            {
                categoryList.map((category) => {
                    return <li key={category._id} onClick={() => handleCategoryClick(category)}>
                        <Typography variant='subtitle2'>
                            {category.gender}
                        </Typography>
                    </li>
                })
            }
        </ul>
    </Box>

  )
}

FilterByCategory.propTypes = {
  onChange: PropTypes.func
}

export default FilterByCategory
